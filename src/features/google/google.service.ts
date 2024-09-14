import * as fs from 'fs';
import { resolve } from 'path';

import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { google } from 'googleapis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { randomColor } from 'randomcolor';
import { Logger } from 'winston';

import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class GoogleService {
  private client: any;
  private readonly serveRoot = '/img/';
  private masterSheetId = '1TwbZ-D_mIXKguA0avPWhj8ngQtC6AsUHekFpbAZh9k8';
  private onlineformId = '17odpB81bf4J7gCYSaG3N0Pn_6WsYelqeFbz4uMtY16w';
  private absensiSheetId = '1Q2_8cZgv36rxchiHtd4NW9qju5lFftz3_UbVsdUM4xI';

  constructor(
    private db: DatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.authenticate(); // Authenticate during module initialization
  }
  
  private async authenticate(): Promise<void> {
    const keys = JSON.parse(fs.readFileSync('client_secret.json', 'utf8'));
    const SCOPES = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.photos.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ];

    const auth = new GoogleAuth({
      credentials: keys,
      scopes: SCOPES,
    });

    this.client = await auth.getClient();
  }

  public getClient() {
    return this.client;
  }

  async connectGSheet() {
    const doc = new GoogleSpreadsheet(this.absensiSheetId, this.getClient());
    await doc.loadInfo();
    return doc;
  }

  async readMasterSheet() {
    const doc = new GoogleSpreadsheet(this.masterSheetId, this.getClient());
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Master Data'];
    await sheet.loadHeaderRow(5);
    return sheet;
  }

  async readMySheet() {
    const doc = new GoogleSpreadsheet(this.onlineformId, this.getClient());
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const sheet2 = doc.sheetsByIndex[1];
    return { sheet, sheet2 };
  }

  async getDriveApi() {
    if (!this.getClient()) {
      throw new Error(
        'Google Service not authenticated. Call authenticate() first.',
      );
    }

    return google.drive({ version: 'v3', auth: this.getClient() });
  }

  async getDocument() {
    const doc = new GoogleSpreadsheet(
      '1uNwEa_HMegXTBq67QzqGjD6udMwkeqjX8C4I-oZhBS0',
      this.getClient(),
    );
    await doc.loadInfo();
    return doc;
  }

  @Cron('30 1 * * *')
  async getKasKecilData() {
    const messages: string[] = [];
    const doc = await this.getDocument();
    const kategori = await this.syncKasKecilKategori(doc);
    const photo = await this.getUpdateFotoNota();
    const sheet = doc.sheetsByTitle['jurnal'];
    await sheet.loadHeaderRow(1);
    // const headers = sheet.headerValues;
    // console.log('Header Row:', headers);
    const rows = await sheet.getRows({ limit: 500 });
    const transactions = await Promise.all(
      rows.map(async (row, i) => {
        // Check if the row is null or undefined, and return null or skip processing
        if (!row) {
          return null; // or return an empty object {} if you prefer
        }
        const tglPenerimaan = row.get('tgl_penerimaan');
        const rectimeStamp = row.get('rectime_stamp');
        const appSheetId = row.get('id');

        if (!appSheetId) {
          return null; // Skip this entry or handle it as needed
        }

        const categoryId = row.get('kategori');
        const transactionType = row.get('masuk_keluar');
        const photoName = row.get('foto');
        let photoExists;
        // Validate categoryId before proceeding

        let categoryExists = await this.db.appsheetKategori.findUnique({
          where: { id: categoryId },
        });

        if (!categoryExists) {
          categoryExists = await this.db.appsheetKategori.findFirst({
            where: {
              type: transactionType,
              category: categoryId, // Assuming categoryId holds the category name in this context
            },
          });
        }

        if (!categoryExists) {
          console.log(categoryId);
          console.error(`Invalid categoryId at row ${i + 1}`);
          return null; // Skip this transaction if categoryId is invalid
        }

        if (photoName != undefined) {
          photoExists = await this.db.appsheetPhoto.findUnique({
            where: { name: photoName.split('/')[1] },
          });
          console.log(photoExists.id);
          return {
            dtTransaction: tglPenerimaan ? this.parseDate(tglPenerimaan) : null,
            appSheetId: appSheetId,
            // categoryId: categoryExists.id,
            timeStamp: rectimeStamp ? this.parseDate(rectimeStamp) : null,
            activity: row.get('deskripsi'),
            value: row.get('nilai'),
            category: {
              connect: {
                id: categoryExists.id,
              },
            },
            photo: photoExists
              ? {
                  connect: {
                    id: photoExists.id,
                  },
                }
              : null,
          };
        }
        return {
          dtTransaction: tglPenerimaan ? this.parseDate(tglPenerimaan) : null,
          appSheetId: appSheetId,
          timeStamp: rectimeStamp ? this.parseDate(rectimeStamp) : null,
          activity: row.get('deskripsi'),
          value: row.get('nilai'),
          category: {
            connect: {
              id: categoryExists.id,
            },
          },
        };
      }),
    );

    const validTransactions = transactions.filter(
      (transaction) => transaction !== null,
    );
    try {
      const result = await Promise.all(
        validTransactions.map(async (transaction) => {
          const {
            appSheetId,
            dtTransaction,
            category,
            timeStamp,
            activity,
            value,
            photo,
          } = transaction;
          await this.db.appsheetTransaksi.upsert({
            where: { appSheetId },
            update: {
              dtTransaction,
              category,
              timeStamp,
              activity,
              value,
              photo,
            },
            create: transaction,
          });
        }),
      );

      messages.push(
        `Transactions successfully upserted in the database: ${result}`,
      );
    } catch (error) {
      console.error('Error upserting transactions:', error.message);
      console.error('Full error:', error);
      throw new Error('Failed to add transactions to the database');
    }

    return [kategori, photo, validTransactions];
  }

  parseDate(dateString) {
    if (typeof dateString !== 'string') {
      console.error('Expected a string but got:', dateString);
      return null; // or throw an error or return new Date()
    }
    // Split date and time if time exists
    const [datePart, timePart] = dateString.split(' ');

    // Split the date part into day, month, and year
    const [month, day, year] = datePart
      .split('/')
      .map((num) => parseInt(num, 10));

    // If there's a time part, handle it; otherwise, create a Date object with just the date
    if (timePart) {
      const [hours, minutes, seconds] = timePart
        .split(':')
        .map((num) => parseInt(num, 10));
        return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
    } else {
      return new Date(Date.UTC(year, month, day));
    }
  }

  async syncKasKecilKategori(doc: {
    loadInfo: () => any;
    sheetsByTitle: { [x: string]: any };
  }) {
    const sheet = doc.sheetsByTitle['kategori'];
    await sheet.loadHeaderRow(1);
    const rows = await sheet.getRows({ limit: 500 });
    let n = 0;
    const categories = await Promise.all(
      rows
        .filter((row) => row.get('id'))
        .map(async (row) => {
          const id = row.get('id');
          const category = row.get('kategori');
          const randomColorHex = randomColor({
            count: 1,
            luminosity: 'bright', // Adjust luminosity as needed
            format: 'hex',
          });
          console.log(randomColorHex);
          const dataExists = await this.db.appsheetKategori.findUnique({
            where: { id },
          });
          if (dataExists) {
            if (dataExists.category !== category) {
              await this.db.appsheetKategori.update({
                where: { id }, // Unique identifier for the upsert
                data: {
                  category,
                  color: dataExists.color
                    ? dataExists.color
                    : randomColorHex[0],
                },
              });
              n++;
            }
            if (!dataExists.color) {
              await this.db.appsheetKategori.update({
                where: { id }, // Unique identifier for the upsert
                data: { color: randomColorHex[0] },
              });
              n++;
            }
            return null; // Skip this entry or handle it as needed
          }
          return {
            id,
            type: row.get('tipe'),
            category,
            color: randomColorHex[0],
          };
        }),
    );
    const validCategories = categories.filter(
      (transaction) => transaction !== null,
    );

    try {
      const result = await this.db.appsheetKategori.createMany({
        data: validCategories,
        skipDuplicates: true,
      });
      console.log(
        `Categories in the database successfully updated: { count: ${n} }`,
      );
      console.log('Categories successfully added to the database:', result);
    } catch (error) {
      console.error('Error adding categories to the database:', error);
      throw new Error('Failed to add categories to the database');
    }

    return validCategories;
  }

  async getPhotoDetail(drive, fileId) {
    try {
      const downloadResponse = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      );
      const imageStream = downloadResponse.data;

      return imageStream;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw for handling in the calling code
    }
  }

  async getUpdateFotoNota(): Promise<any[]> {
    const drive = await this.getDriveApi(); // Assume this method returns the Drive API client
    const destinationFolder = resolve(process.cwd(), '..', 'images'); // Store in the 'public/images' directory
    const folderId = '1UMqhmCsA5fSmU8euwKjcCPjJfBqM4pjm'; // Replace with your actual folder ID
    let nextPageToken = null,
      updatedImage = [];
    // Ensure the destination folder exists
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    do {
      const res = await drive.files.list({
        pageSize: 1000,
        pageToken: nextPageToken,
        q: `'${folderId}' in parents AND mimeType contains 'image/'`,
        fields:
          'nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink)',
      });

      const files = res.data.files;
      if (!files.length) {
        this.logger.info({ message: 'No image files found in the folder.' });
        return;
      }

      for (const file of files) {
        if (file.thumbnailLink) {
          const filePath = resolve(destinationFolder, file.name);
          const thumbnailPath = resolve(
            destinationFolder + '/small/',
            file.name,
          );

          try {
            // Check if the file already exists
            if (!fs.existsSync(filePath)) {
              // Download the image from the thumbnailLink
              const fullSizeLink = file.thumbnailLink.replace(/=s220/g, '');
              const response = await axios.get(fullSizeLink, {
                responseType: 'arraybuffer',
              });
              const response2 = await axios.get(file.thumbnailLink, {
                responseType: 'arraybuffer',
              });
              // Save the file locally
              fs.writeFileSync(filePath, response.data);
              fs.writeFileSync(thumbnailPath, response2.data);
            } else
              this.logger.info({
                message: `Image already exists: ${file.name}, skipping download.`,
              });

            const imageLink = `${this.serveRoot}${file.name}`;
            const thumbnailLink = `${this.serveRoot}small/${file.name}`;
            const result = await this.db.appsheetPhoto.upsert({
              where: {
                name: file.name,
              },
              update: {
                thumbnailLink,
                imageLink,
                downloadLink: file.webContentLink,
              },
              create: {
                id: file.id,
                name: file.name,
                thumbnailLink,
                imageLink,
                downloadLink: file.webContentLink,
              },
            });
            this.logger.info({
              message: `Saved image: ${file.name} to ${filePath}. Accessible at: ${imageLink}`,
            });
            updatedImage.push(result);
          } catch (error) {
            this.logger.error({
              message: `Failed to save image: ${file.name}`,
              error: error.message,
            });
          }
        }
      }

      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken);
    return updatedImage;
  }

  // async getSpreadsheetData(spreadsheetId: string, range: string) {
  //   console.log(this.getClient())
  //   const sheets = google.sheets({ version: 'v4', auth: this.getClient() });
  //   console.log(sheets)
  //   const res = await sheets.spreadsheets.values.get({
  //     spreadsheetId:'1TwbZ-D_mIXKguA0avPWhj8ngQtC6AsUHekFpbAZh9k8',
  //     range,

  //   });
  //   return res.data.values;
  // }
}
