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
  @Get('sheet')
  async getMastersheetData() {
    await this.googleService.authenticate();
    const sheet = await this.googleService.getMastersheetData();
    const rows = await sheet.getRows()
    const participants = rows.filter((row)=>row.get('Nama Lengkap')).map((row, i) => ({ id: i, name: row.get('Nama Lengkap'), sex: row.get('Jenis Kelamin') }));
    return participants;
  }
}
