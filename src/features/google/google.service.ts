import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class GoogleService {
  private client: any; // Placeholder for the authenticated client

  async authenticate(): Promise<void> {
    const keys = JSON.parse(fs.readFileSync('client_secret.json', 'utf8'));
    const SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.photos.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
      ]      

    const auth = new GoogleAuth({
      credentials: keys,
      scopes: SCOPES,
    });

    this.client = await auth.getClient();
    return this.client;
  }

  async getDriveApi() {
    if (!this.client) {
      throw new Error('Google Service not authenticated. Call authenticate() first.');
    }

    return google.drive({ version: 'v3', auth: this.client });
  }

  async getSpreadsheetData(spreadsheetId: string, range: string) {
    console.log(this.client)
    const sheets = google.sheets({ version: 'v4', auth: this.client });
    console.log(sheets)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId:'1TwbZ-D_mIXKguA0avPWhj8ngQtC6AsUHekFpbAZh9k8',
      range,   

    });
    return res.data.values;
  }
  async getMastersheetData() {
    const doc = new GoogleSpreadsheet('1TwbZ-D_mIXKguA0avPWhj8ngQtC6AsUHekFpbAZh9k8', this.client);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Master Data']
    await sheet.loadHeaderRow(5);
    return sheet
  }
}