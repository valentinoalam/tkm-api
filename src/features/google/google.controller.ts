import { Controller, Get, Param } from '@nestjs/common';
import { GoogleService } from './google.service';
import { drive_v3 } from 'googleapis';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('drive')
  async getDriveApi() {
    await this.googleService.authenticate(); // Ensure authentication
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

  @Get('/:spreadsheetId/:range')
  async getSpreadsheetData(@Param('spreadsheetId') spreadsheetId: string, @Param('range') range: string) {
    await this.googleService.authenticate();
    const data = await this.googleService.getSpreadsheetData(spreadsheetId, range);
    return data;
  }
  @Get('itiqaf-sheet')
  async getMastersheetData() {
    await this.googleService.authenticate();
    const sheet = await this.googleService.getMastersheetData();
    const rows = await sheet.getRows()
    const participants = rows.filter((row)=>row.get('Nama Lengkap')).map((row, i) => ({ id: i, name: row.get('Nama Lengkap'), sex: row.get('Jenis Kelamin') }));
    return participants;
  }

  @Get('foto-nota')
  async getFotoNotaData() {
    await this.googleService.authenticate(); // Ensure authentication

    const drive = await this.googleService.getDriveApi(); // Assume this method returns the Drive API client
    const folderId = '1UMqhmCsA5fSmU8euwKjcCPjJfBqM4pjm'; // Replace with your actual folder ID
    let files, nextPageToken;

    try {
      const res = await drive.files.list({
        pageSize: 1000,
        pageToken: nextPageToken,
        q: `'${folderId}' in parents AND mimeType contains 'image/'`, // Search for image files within the folder
        fields: 'nextPageToken, files(id, name, mimeType)',
      });

      files = res.data.files;

      if (!files || files.length === 0) {
        console.log('No image files found in the folder.');
        return []; // Return empty array if no images found
      }

      // Extract image URLs from the retrieved files
      // const imageUrls = files.map(file => ({
      //   name: file.name,
      //   url: `https://drive.google.com/uc?export=view&id=${file.id}`, // Assuming public access
      // }));
      console.log('Files:');
      files.map((file) => {
          console.log(`${file.name} (${file.id})`);
      });
      nextPageToken = res.data.nextPageToken;
      if(nextPageToken) console.log(nextPageToken)
      return files;
    } catch (error) {
      console.error('Error fetching foto-nota data:', error);
      throw new Error('Failed to fetch image data from Google Drive'); // Custom error message
    }
  }

  @Get('kas-kecil')
  async getKasKecilData() {
    await this.googleService.authenticate();
    const jurnal = await this.googleService.getKasKecilData();

    return jurnal;
  }
  @Get('kategori-entry')
  async syncKasKecilKategori() {
    await this.googleService.authenticate();
    const categories = await this.googleService.syncKasKecilKategori();

    return categories;
    
  }
  
}
