// const Boom = require('@hapi/boom');
const { google } = require('googleapis');
const fs = require("fs");
const client = require('../helpers/gClient.js');

const { MongoClient } = require('mongodb'); // Assuming you have MongoDB driver installed
const Quran1Id = '15nmhsqDBFltS-2NW3UPsut0ksR7Gxu68' 
const Quran2Id = '1nRZUoPIC8H1PYAyzhPVAaYKBO4JninkZ'
// const files = require('../database/data/filesInDrive.json');
const uri = "mongodb+srv://ichikyube:kucingkucing@cluster0.scvmkyg.mongodb.net/";
const dbName = "asalamdb";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectDb() {
    await mongoClient.connect();
    const database = mongoClient.db(dbName);
    return database;
}
async function storeFolderId(folderId) {
    try{
        const database = await connectDb();
        const collection = database.collection("driveFolder"); 
        const storedFolder = await collection.findOne({ _id: folderId });
        if(!storedFolder) {
            const data = {
                _id: folderId,
                name: 'AlQuran1-jpg'
              };
            return await collection.insertOne(data);
        }
        return console.log("folderId is found")
    } catch (error) {
        console.error("Error connecting to database:", error);
        // You might want to consider re-throwing the error or returning a specific value
        // to indicate an error to the calling code.
    }
}

async function storeDataToMongoDB(files, folderId) {
    storeFolderId(folderId);
    try {
        const database = await connectDb();
        const collection = database.collection("driveFile"); 
        // Sort the data by the 'page' value
        const data = files.filter(file=>file.mimeType === "image/png")
        .map((file) => ({
            _id: file.id,
            name: file.name.split('.')[0],
            driveFolder_id: folderId
        }))
        .sort((a, b) => a.name - b.name); // Sort a copy to avoid modifying original data

        const result = await collection.insertMany(data);
        console.log("Data stored successfully:", result.insertedId);
        // fs.writeFile('database/data/filesInDrive.json', JSON.stringify(sortedPages, null, 2), (err) => {
        //     if (err) {
        //     console.error('Error writing data to file', err);
        //     }
        //     console.log('Data fetched and written successfully');
        // });
    } catch (error) {
        console.error("Error storing data:", error);
    } finally {
        await mongoClient.close();
    }
}

async function fetchAudioData (auth, fileId){
    const drive = google.drive({ version: 'v3', auth });
    try {
        const collection = connectDb();
        const listOfAudioIds =  await collection.find().toArray();
        // const fileResponse = await drive.files.get({ fileId: fileId, fields: 'mimeType' });
        // const mimeType = fileResponse.data.mimeType;

        // if (!mimeType.startsWith('audio/')) {        // Ensure it's an audio file
        //     throw new Error('Not an audio file');
        // }
        if(!listOfAudioIds.includes(fileId)) throw new Error('Not an audio file');
        // Download the actual audio data using alt=media
        const downloadResponse = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        return downloadResponse.data; // Return the downloaded audio data
    } catch (error) {
        console.error(error);
        throw error; // Re-throw for handling in the calling code
    }
}
async function fetchQuranData (auth, pageIndex){
    const drive = google.drive({ version: 'v3', auth });
    try {
        const database = await connectDb();
        const collection = database.collection("driveFile")
        const pagesId = await collection.findOne({driveFolder_id: Quran1Id, name: pageIndex})
        // const pagesId = await collection.aggregate([
        //     { $match: { folderId: Quran1Id } },
        //     { $project: { fileId: { $arrayElemAt: ["$files", parseInt(pageIndex)] } } }
        // ]).toArray();
        // const downloadResponse = await drive.files.get({ fileId: pagesId[0].fileId, alt: 'media' }, { responseType: 'stream' });
        // Download the actual audio data using alt=media
        const downloadResponse = await drive.files.get({ fileId: pagesId._id, alt: 'media' }, { responseType: 'stream' });
        return downloadResponse.data; // Return the downloaded audio data
    } catch (error) {
        console.error(error);
        throw error; // Re-throw for handling in the calling code
    }
}
const getListInGDriveHandler = async (request, h) => {
    const drive = google.drive({ version: 'v3', client });
    let files, nextPageToken;
    const folderId = Quran1Id //'1oUuM8jgnJ-PNmE6v9say_qqPN3FTO1K8';
    try {
        const res = await drive.files.list({
            pageSize: 1000,
            nextPageToken,
            q: `'${folderId}' in parents`, // Search for files within the specific folder
            fields: 'files(id, name, mimeType)', // Only fetch specific file properties
        }, { auth: client });
        files = res.data.files;
        if (files.length === 0) {
            console.log('No files found.');
            return;
        }
        console.log('Files:');
        files.map((file) => {
            console.log(`${file.name} (${file.id})`);
        });
        nextPageToken = res.nextPageToken;
        if(nextPageToken) console.log(nextPageToken)
        storeDataToMongoDB(files, folderId)
        return h.response({files,folderId});
    } catch (error) {
        console.error(error);
        throw error; // Re-throw for handling in the calling code
    }
}
const getQuranPageHandler = async (request, h) => {
    try {
        const pageIndex = request.query.pageIndex; // Get file ID from request query
        const fileData = await fetchQuranData(client, pageIndex);
        const response = h.response(fileData).type('image/jpeg');//.header("Content-Description", 'File Transfer').code(206); // Adjust content type as needed
        response.headers['Content-Length'] = fileData.size; // Optional: Set Content-Length header for large files
        return response;
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to fetch file' }).code(500);
    }
}
const getFileFromGDriveHandler = async (request, h) => {
    try {
        const fileId = request.query.fileId; // Get file ID from request query
        const fileData = await fetchFileData(client, fileId);
        const response = h.response(fileData).type('audio/mpeg');//.header("Content-Description", 'File Transfer').code(206); // Adjust content type as needed
        response.headers['Content-Length'] = fileData.size; // Optional: Set Content-Length header for large files
        return response;
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to fetch file' }).code(500);
    }
}

module.exports = {
    getQuranPageHandler,
    getFileFromGDriveHandler,
    getListInGDriveHandler,
}