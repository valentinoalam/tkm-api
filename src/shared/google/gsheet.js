// const Boom = require('@hapi/boom');
const {GoogleSpreadsheet} = require('google-spreadsheet');
const client = require('../helpers/gClient.js');
const masterSheetId= '1TwbZ-D_mIXKguA0avPWhj8ngQtC6AsUHekFpbAZh9k8'
const categoryId= '1uNwEa_HMegXTBq67QzqGjD6udMwkeqjX8C4I-oZhBS0'
const absensiSheetId= '1Q2_8cZgv36rxchiHtd4NW9qju5lFftz3_UbVsdUM4xI'

function flattenObject(obj, parentKey = '', sep = '.') {
    let flattened = {};
   
    for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
         const propName = parentKey ? `${key}` : key;
   
         if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
           Object.assign(flattened, flattenObject(obj[key], propName, sep));
         } else {
           flattened[propName] = obj[key];
         }
       }
    }
   
    return flattened;
}

async function connectGSheet() {
    const doc = new GoogleSpreadsheet(categoryId, client);
    await doc.loadInfo();
    return doc;
}
async function readMasterSheet() {
    const doc = new GoogleSpreadsheet(masterSheetId, client);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Master Data']
    await sheet.loadHeaderRow(5);
    return sheet
}
async function readMySheet() {
    const doc = new GoogleSpreadsheet(onlineformId, client);
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    const sheet2 = doc.sheetsByIndex[1];
    return {sheet, sheet2}
}

const getAllPesertaItiqafHandler = async (_, h) => {
    try {
        const sheet = await readMasterSheet();
        const rows = await sheet.getRows()
        const participants = rows.filter((row)=>row.get('Nama Lengkap')).map((row, i) => ({ id: i, name: row.get('Nama Lengkap'), sex: row.get('Jenis Kelamin') }));
        return h.response(participants).type('application/json').header('cache-control', 'no-cache').code(200);
    } catch (error) {
        console.error(error);
        return h.response('Error fetching data').code(500);
    }
}
const addPesertaItiqafHandler = async (request, h) => {
    let {
        nama,
        jenisKelamin,
        tanggalLahir,
        noHP,
        denganKeluarga,
        alamatKTP,
        equalKTP,
        alamatDom,
        anggota: keluarga,
        kontakDarurat,
        hadir_itiqaf
    } = request.payload;
    tanggalLahir = new Date(tanggalLahir)
    const birthYear = tanggalLahir.getFullYear()
    const birthMoon = tanggalLahir.getMonth()
    const birthDate = tanggalLahir.getDate()
    const usia = calculateAge(birthYear, birthMoon, birthDate)
    alamatKTP = alamatKTP.komplek === "Lainnya"? alamatKTP.komplek_lainnya + " " + alamatKTP.jalan + ', ' + alamatKTP.kelurahan.label + ', ' + alamatKTP.kecamatan.label + ', ' + alamatKTP.kabupaten.label + ', ' + alamatKTP.propinsi.label + ' ' + alamatKTP.kodepos : 
    alamatKTP.komplek + ' ' + alamatKTP.jalan + " Jakasampurna, Bekasi Barat, Kota Bekasi, Jawa Barat 17145"
    const plan = 
       Object.keys(hadir_itiqaf).reduce((acc, key) => {
        const newKey = 'h-' + hadir_itiqaf[key];
        acc[newKey] = '✔';
        return acc;
    }, {});
    const {        
        nama: namakontakDarurat,
        phone1: nokontakDarurat
    } = kontakDarurat
    const newRow = {
        nama,
        'jenis-kelamin':jenisKelamin,
        'tanggal-lahir': tanggalLahir,
        usia,
        'no-hp_pribadi': noHP.startsWith('0') ? noHP: '0' + noHP,
        alamat_ktp:  alamatKTP,
        alamat_domisili: equalKTP === true?'sama dengan ktp': alamatDom,
        bersama: denganKeluarga === true? 'bersama' : 'sendiri',
        'nama_kontak-darurat':namakontakDarurat,
        'no_kontak-darurat':nokontakDarurat,
        plan
    }
    
    try {
        const {sheet, sheet2} = await readMySheet();
        await sheet.addRow(flattenObject(newRow));
        if (denganKeluarga) {
            await Promise.all(keluarga.map(async (element) => {
                element.pendaftar = newRow.nama;
              try {
                await sheet2.addRow(element);
              } catch (error) {
                console.error("Error adding keluarga element:", error);
              }
            }));
        }
        const response = h.response({
            message: 'Data received successfully',
            payload: request.payload
        }).type('application/json').header('cache-control', 'no-cache').code(201);
        return response;
    } catch (error) {
        console.error(error);
        return h.response('Error fetching data').code(500);
    }
}
const nights={7:'Malam ke 8',8:'Malam ke 9',9:'Malam ke 10'}
const absensiHarianPesertaItiqafbyNameHandler = async (request, h) => {
    const doc = await connectGSheet();
    const sheet = doc.sheetsByIndex[0]; // Assuming you're working with the first sheet
    const rows = await sheet.getRows(); // Fetch all rows
    const { nama } = request.params
    const check = request.payload.check? '✓' : '✕'
    const malamIni = nights[new Date().getDate()]
    // Find the row with the same name as the user's login
    const userRow = rows.find(row => row.get('Nama Lengkap') === nama); // Assuming 'Name' is the column name for user names
    if (userRow) {
       // Update the attendance status for the found row
       userRow.set(malamIni, check);
       await userRow.save();
       return h.response({ date: new Date(), message: 'Attendance updated for ${nama}' }).header('cache-control', 'no-cache').code(200);
    } else {
        console.log(`User ${nama} not found`);
        return h.response({message:'User ${nama} not found'}).code(400);
    }
}

module.exports = {
    getAllPesertaItiqafHandler,
    addPesertaItiqafHandler,
    absensiHarianPesertaItiqafbyNameHandler,
}