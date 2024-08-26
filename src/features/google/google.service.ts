import { Category } from './../ledger/components/transactions/components/category/entities/category.entity';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as fs from 'fs';
import path, { join } from 'path';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class GoogleService {
  constructor(private db: DatabaseService) {}
  private client: any; // Placeholder for the authenticated client

  async authenticate(): Promise<void> {
    const secretPath =  path.resolve(__dirname, 'client_secret.json');
    console.warn("psyh " + secretPath)
    const keys = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
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
  async getKasKecilData() {
    const doc = new GoogleSpreadsheet('1uNwEa_HMegXTBq67QzqGjD6udMwkeqjX8C4I-oZhBS0', this.client);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['jurnal']
    await sheet.loadHeaderRow(1);
    // const headers = sheet.headerValues;
    // console.log('Header Row:', headers);
    const rows = await sheet.getRows({limit: 500})
    const transactions = await Promise.all(rows.map(async (row, i) => {
      // Check if the row is null or undefined, and return null or skip processing
      if (!row) {
        return null; // or return an empty object {} if you prefer
      }
      const tglPenerimaan = row.get('tgl_penerimaan');
      const rectimeStamp = row.get('rectime_stamp');
      const appSheetId = row.get('id'); 

      if (!appSheetId) {
          console.error(`Missing appSheetId at row ${i + 1}`);
          return null; // Skip this entry or handle it as needed
      }
      // let dataExists = await this.db.appsheetTransaksi.findUnique({
      //   where:  { id: appSheetId }
      // });
      // if (dataExists) {
      //   return null; // Skip this entry or handle it as needed
      // }
      const categoryId = row.get('kategori');
      const transactionType = row.get('masuk_keluar');
      // Validate categoryId before proceeding
      
      let categoryExists = await this.db.appsheetKategori.findUnique({
        where:  { id: categoryId }
      });

      if (!categoryExists) {
        categoryExists = await this.db.appsheetKategori.findFirst({
          where: { 
                type: transactionType,
                category: categoryId // Assuming categoryId holds the category name in this context
              },
          })
      }
      if (!categoryExists) {
          console.log(categoryId)
          console.error(`Invalid categoryId at row ${i + 1}`);
          return null; // Skip this transaction if categoryId is invalid
      }
      return {
          index: i + 1,
          dtTransaction: tglPenerimaan ? this.parseDate(tglPenerimaan) : null,
          appSheetId: appSheetId,
          categoryId: categoryExists.id,
          timeStamp: rectimeStamp ? this.parseDate(rectimeStamp) : null,
          activity: row.get('deskripsi'),
          in_out: transactionType,
          value: row.get('nilai'),
          photoUrl: row.get('foto')
      };
  }));

  const validTransactions = transactions.filter(transaction => transaction !== null);
  console.log('Valid transactions:', validTransactions);
    try {
      const result = await Promise.all(validTransactions.map(async transaction => {
        const {appSheetId, dtTransaction, categoryId, timeStamp, activity, in_out, value, photoUrl} = transaction
        await this.db.appsheetTransaksi.upsert({
          where: { appSheetId },
          update: { dtTransaction, categoryId, timeStamp, activity, in_out, value, photoUrl },
          create: transaction,
        });
      }));

      console.log('Transactions successfully upserted in the database:', result);
    } catch (error) {
      console.error('Error upserting transactions:', error.message);
      console.error('Full error:', error);
      throw new Error('Failed to add transactions to the database');
    }
  
    return validTransactions;
  }

  parseDate(dateString) {
    if (typeof dateString !== 'string') {
      console.error("Expected a string but got:", dateString);
      return null; // or throw an error or return new Date()
  }
    // Split date and time if time exists
    const [datePart, timePart] = dateString.split(' ');

    // Split the date part into day, month, and year
    const [month, day, year] = datePart.split('/').map(num => parseInt(num, 10));

    // If there's a time part, handle it; otherwise, create a Date object with just the date
    if (timePart) {
        const [hours, minutes, seconds] = timePart.split(':').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day, hours, minutes, seconds);
    } else {
        return new Date(year, month - 1, day);
    }
  }

  async syncKasKecilKategori() {
    const doc = new GoogleSpreadsheet('1uNwEa_HMegXTBq67QzqGjD6udMwkeqjX8C4I-oZhBS0', this.client);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['kategori']
    await sheet.loadHeaderRow(1);
    const rows = await sheet.getRows({limit: 500})
    const categories = await Promise.all(rows.filter((row)=>row.get('id')).map(async(row) => { 
      const id = row.get('id');
      const category = row.get('kategori');
      let dataExists = await this.db.appsheetKategori.findUnique({
        where:  { id }
      });
      if (dataExists) {
        if(dataExists.category !== category)
          await this.db.appsheetKategori.update({
            where: { id }, // Unique identifier for the upsert
            data: { category }
          });
        return null; // Skip this entry or handle it as needed
      }
      return {
        id, 
        type: row.get('tipe'), 
        category,
      }
    }));
    const validCategories = categories.filter(transaction => transaction !== null)

    try {
      const result = await this.db.appsheetKategori.createMany({
        data: validCategories,
        skipDuplicates: true,
      });

      console.log('Categories successfully added to the database:', result);
    } catch (error) {
      console.error('Error adding categories to the database:', error);
      throw new Error('Failed to add categories to the database');
    }
  
    return validCategories;
  }
}