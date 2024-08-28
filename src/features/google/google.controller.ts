import { Controller, Get, HttpException, HttpStatus, Inject, Param, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { drive_v3 } from 'googleapis';
import { Response } from 'express';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { PassThrough } from 'stream';
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('drive')
  async getDriveApi() {
    //await this.googleService.authenticate(); // Ensure authentication
    const drive = await this.googleService.getDriveApi();
    // https://docs.google.com/spreadsheets/d/1uNwEa_HMegXTBq67QzqGjD6udMwkeqjX8C4I-oZhBS0/edit?usp=drive_link
    //categori:https://docs.google.com/spreadsheets/d/1uNwEa_HMegXTBq67QzqGjD6udMwkeqjX8C4I-oZhBS0/edit?usp=sharing
    // galeri:https://drive.google.com/drive/folders/1UMqhmCsA5fSmU8euwKjcCPjJfBqM4pjm?usp=drive_link
    const arr = [
      '1OJtHQdWEZDb1GAbIxvcuLQOGVoiRti5p',
      '1s2d6gtWf-so5gyo1rrPlU6EICczyyYCF',
      '13vlDfBvUOSdIaZFQjTx0tkjKU09m8yQj',
      '1GA6APNnxZAwZrHmS4YuGwyEHP6khf7j3'
    ]
    try {
      console.log(drive)

      let res;
      for (let i=0;i<arr.length;i++) {
        const listParams: drive_v3.Params$Resource$Files$List = {
          q: `${arr[i]} in parents`, // Search for files within the specific folder
          fields: 'files(name, mimeType)', // Only fetch specific file properties
        }
        res = drive.files.list(listParams);
        console.log(res.data)
      }
      return res;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw for handling in the calling code
    }
    // Use the 'drive' API instance to make API calls
  }

  // @Get('/:spreadsheetId/:range')
  // async getSpreadsheetData(@Param('spreadsheetId') spreadsheetId: string, @Param('range') range: string) {
  //   //await this.googleService.authenticate();
  //   const data = await this.googleService.getSpreadsheetData(spreadsheetId, range);
  //   return data;
  // }
  // @Get('itiqaf-sheet')
  // async getMastersheetData() {
  //   //await this.googleService.authenticate();
  //   const sheet = await this.googleService.getMastersheetData();
  //   const rows = await sheet.getRows()
  //   const participants = rows.filter((row)=>row.get('Nama Lengkap')).map((row, i) => ({ id: i, name: row.get('Nama Lengkap'), sex: row.get('Jenis Kelamin') }));
  //   return participants;
  // }

  @Get('foto-nota')
  async getFotoNotaData() {
    //await this.googleService.authenticate(); // Ensure authentication

    const drive = await this.googleService.getDriveApi(); // Assume this method returns the Drive API client
    const gallery = await this.googleService.getFotoNotaData(drive);

    return gallery;
    
  }

  @Get('kas-kecil')
  async getKasKecilData() {
    //await this.googleService.authenticate();
    const jurnal = await this.googleService.getKasKecilData();

    return jurnal;
  }
  @Get('kategori-entry')
  async syncKasKecilKategori() {
    //await this.googleService.authenticate();
    const categories = await this.googleService.syncKasKecilKategori();

    return categories;
    
  }
  
  @Get('image/:fileId')
  async getImage(@Param('fileId') fileId: string, @Res() res: Response) {
    // const cacheKey = 'key';
    // const cachedImage = await this.cacheManager.get(cacheKey);

    // if (cachedImage) {
    //   console.log("myamya")
    //   const cachedStream = new PassThrough();
    //   cachedStream.end(cachedImage);
    //   res.setHeader('Content-Type', 'image/jpeg');
    //   return cachedStream.pipe(res); // Return the cached image
    // }

    try {
      //await this.googleService.authenticate();
      const drive = await this.googleService.getDriveApi(); 
      const fileStream = await this.googleService.getPhotoDetail(drive, fileId);
      res.setHeader('Content-Type', 'image/jpeg');
      fileStream.pipe(res);
      // // Cache the image stream
      // this.cacheManager.set(cacheKey, file, 600);
      // const chunks = [];
      // fileStream.on('data', chunk => {
      //   chunks.push(chunk);
      // });

      // fileStream.on('end', async () => {
      //   const buffer = Buffer.concat(chunks);
      //   try {
      //     await this.cacheManager.set(cacheKey, buffer, 600);
      //     console.log("Cached image successfully");
      //   } catch (cacheError) {
      //     console.error('Failed to cache image:', cacheError);
      //   }
      //   const stream = new PassThrough();
      //   stream.end(buffer);
      //   res.setHeader('Content-Type', 'image/jpeg');
      //   stream.pipe(res);
      // });

      // fileStream.on('error', error => {
      //   console.error('Error streaming file:', error);
      //   res.status(500).send('Error streaming file');
      // });

    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to fetch file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
