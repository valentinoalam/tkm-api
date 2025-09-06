import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { CreateItiqafDto } from './dto/create-itiqaf.dto';
import { UpdateItiqafDto } from './dto/update-itiqaf.dto';

@Injectable()
export class ItiqafService {
  constructor(private readonly googleSheetsService: GoogleService) {}
  private flattenObject(obj: any, parentKey = '', sep = '.'): any {
    let flattened = {};

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const propName = parentKey ? `${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], propName, sep));
        } else {
          flattened[propName] = obj[key];
        }
      }
    }

    return flattened;
  }

  private calculateAge(year: number, month: number, day: number): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentDay = currentDate.getUTCDate();

    let age = currentYear - year;
    if (currentMonth > month || (currentMonth === month && currentDay >= day)) {
      return age;
    } else {
      return age - 1;
    }
  }

  async getAllPesertaItiqaf(): Promise<any> {
    try {
      const sheet = await this.googleSheetsService.readMasterSheet();
      const rows = await sheet.getRows();
      const participants = rows
        .filter(row => row.get('Nama Lengkap'))
        .map((row, i) => ({
          id: i,
          name: row.get('Nama Lengkap'),
          sex: row.get('Jenis Kelamin'),
        }));
      return participants;
    } catch (error) {
      throw new HttpException('Error fetching data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addPesertaItiqaf(data: any): Promise<any> {
    try {
      const {
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
        hadir_itiqaf,
      } = data;

      const usia = this.calculateAge(
        new Date(tanggalLahir).getFullYear(),
        new Date(tanggalLahir).getMonth(),
        new Date(tanggalLahir).getDate(),
      );

      const formattedAlamatKTP = equalKTP
        ? 'Sama dengan KTP'
        : `${alamatKTP.jalan}, ${alamatDom.kelurahan}, ${alamatDom.kecamatan}, ${alamatDom.kabupaten}, ${alamatDom.propinsi} ${alamatKTP.kodepos}`;

      const newRow = {
        nama,
        'jenis-kelamin': jenisKelamin,
        'tanggal-lahir': tanggalLahir,
        usia,
        'no-hp': noHP,
        alamatKTP: formattedAlamatKTP,
        plan: hadir_itiqaf.reduce((acc, key) => ({ ...acc, ['h-' + key]: '✔' }), {}),
      };

      const { sheet, sheet2 } = await this.googleSheetsService.readMySheet();
      await sheet.addRow(this.flattenObject(newRow));

      if (denganKeluarga) {
        await Promise.all(
          keluarga.map(async element => {
            element.pendaftar = newRow.nama;
            await sheet2.addRow(element);
          }),
        );
      }

      return { message: 'Data added successfully' };
    } catch (error) {
      throw new HttpException('Error adding data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async absensiHarianPeserta(nama: string, check: boolean): Promise<any> {
    try {
      const doc = await this.googleSheetsService.connectGSheet();
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      const userRow = rows.find(row => row.get('Nama Lengkap') === nama);

      if (userRow) {
        userRow.set('Attendance', check ? '✓' : '✕');
        await userRow.save();
        return { message: `Attendance updated for ${nama}` };
      } else {
        throw new HttpException(`User ${nama} not found`, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('Error updating attendance', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  create(createItiqafDto: CreateItiqafDto) {
    return 'This action adds a new itiqaf';
  }

  findAll() {
    return `This action returns all itiqaf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itiqaf`;
  }

  update(id: number, updateItiqafDto: UpdateItiqafDto) {
    return `This action updates a #${id} itiqaf`;
  }

  remove(id: number) {
    return `This action removes a #${id} itiqaf`;
  }
}
