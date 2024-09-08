import path from 'path';
import { Injectable } from '@nestjs/common';

import {
  CreateAppsheetKategoriDto,
  CreateAppsheetTransaksiDto,
} from './dto/create-dari-appsheet.dto';
import {
  UpdateAppsheetKategoriDto,
  UpdateAppsheetPhotoDto,
  UpdateAppsheetTransaksiDto,
} from './dto/update-dari-appsheet.dto';

import { DatabaseService } from '@/core/database/database.service';
import { getPaginatedData, PaginatedResult } from '@/shared/utils/paginate-data.utils';
import { Transaction } from './transaction.interface';
import { AppsheetTransaksi } from './entities/dari-appsheet.entity';
import { Prisma } from '@prisma/client';

export interface PaginatedTransactionResult extends PaginatedResult<Transaction> {}

const bigIntReplacer = (key, value) => {
  return typeof value === 'bigint' ? value.toString() : value;
};
@Injectable()
export class DariAppsheetService {
  constructor(private db: DatabaseService) {}

  async showAllNotaImage() {
    return this.db.appsheetPhoto.findMany({
      include: {
        transaksi: {
          select: {
            id: true,
            dtTransaction: true,
            activity: true,
            value: true,
            category: {
              select: {
                category: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        transaksi: {
          dtTransaction: 'desc',
        },
      },
    });
  }

  async getTransactionsDataChart() {
    const data = await this.db.appsheetTransaksi.findMany({
      where: { isDeleted: false },
      include: {
        category: {
          select: {
            category: true, // Include the category name
            type: true,
            color: true,
          },
        },
      },
      orderBy: {
        dtTransaction: 'desc',
      },
    });

    const transactionData = await data.map(
      ({ dtTransaction, category, value }) => ({
        dtTransaction,
        category: category.category,
        color: category.color,
        in_out: category.type,
        value,
      }),
    );
    return transactionData;
  }

  async getChartDataReport() {
    const groupedData = await this.db.$queryRaw`
      SELECT 
        YEAR(at.dtTransaction) AS year,
        MONTH(at.dtTransaction) AS month,
        ak.category AS category,
        ak.type AS in_out,
        ak.color AS color,
        SUM(at.amount) AS sum
      FROM AppsheetTransaksi at
      JOIN AppsheetKategori ak ON at.category_id = ak.id
      WHERE at.isDeleted = false
      GROUP BY 
        YEAR(at.dtTransaction),
        MONTH(at.dtTransaction),
        ak.category,
        ak.type,
        ak.color
      ORDER BY 
        YEAR(at.dtTransaction),
        MONTH(at.dtTransaction);
    `;
  

    const dataParsed = JSON.parse(JSON.stringify(groupedData, bigIntReplacer));
    // Process the data to aggregate sums by month for each year
    const months = Array.from(new Set(dataParsed.map(item=>item.month)));

    const aggregatedData = dataParsed.reduce((acc, { month, sum, category, in_out, color }) => {
      // Ensure category exists in accumulator
      acc[category] = acc[category] || {};
    
      // Utilize a single array per category (no year needed)
      const categoryData = acc[category];
      const monthIndex = months.indexOf(month); // Get month index
    
      // Check if month exists and initialize if necessary
      if (!categoryData[monthIndex]) {
        categoryData[monthIndex] = { in: 0, out: 0 };
      }
      if (in_out === 'Penerimaan') {
        categoryData[monthIndex].in = sum || 0; // month - 1 for zero-based index
      } else if (in_out === 'Pengeluaran') {
        categoryData[monthIndex].out = sum || 0; // month - 1 for zero-based index
      }
      categoryData.color = color
      return acc;
    }, {});
    // Convert the aggregated data into the desired format
    const result = [];
    for (const [category, monthData] of Object.entries(aggregatedData)) {
      const inData = [];
      const outData = [];
  
      for (let month = 0; month < months.length; month++) {
        inData.push(monthData[month]?.in || 0);
        outData.push(monthData[month]?.out || 0);
      }
  
      result.push({ name: `in${category}`, data: inData, group: "Penerimaan", color: monthData["color"] });
      result.push({ name: `out${category}`, data: outData, group: "Pengeluaran", color: monthData["color"]  });
    }
    return {result, months};
  }

  async findAllTransactions(
    dateStart?: string,
    dateEnd?: string,
    page?: number,
    limit?: number,
    search?: string
  ) {
    const params: (string | number)[] = [];
    const conditions: string[] = [];
    
    // Pagination calculations
    const offset = (page - 1) * limit;

    if (search) {
      const searchLike = `%${search}%`; // Use % for SQL LIKE operator
      conditions.push(`(at.activity LIKE ? OR ak.category LIKE ?)`);
      params.push(searchLike, searchLike);
    }

    if (dateStart && dateEnd) {
      conditions.push(`at.dtTransaction BETWEEN ? AND ?`);
      params.push(dateStart, dateEnd);
    } else if (dateEnd) {
      conditions.push(`at.dtTransaction <= ?`);
      params.push(dateEnd);
    } else if (dateStart) {
      conditions.push(`at.dtTransaction >= ?`);
      params.push(dateStart);
    }

    // Query to count total records
    const countQuery = `
      SELECT COUNT(*)
      FROM AppsheetTransaksi at
      JOIN AppsheetKategori ak ON at.category_id = ak.id
      WHERE at.isDeleted = false
      ${conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : ''}
    `;

    // Fetch total records
    const totalRecordsResult = await this.db.$queryRawUnsafe(countQuery, ...params);
    const totalRecords =  Number(totalRecordsResult[0]['COUNT(*)']);
    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    if(limit){ // Adding limit and offset to parameters
      page = page? page : 0;
      params.push(limit, offset);
    }

    const query = `
      SELECT 
        at.id,
        at.dtTransaction,
        at.activity,
        at.category_id AS categoryId
        ak.category,
        ak.type,
        ak.color,
        at.amount,
        ap.name AS photo,
        ap.downloadLink AS downloadLink
      FROM AppsheetTransaksi at
      JOIN AppsheetKategori ak ON at.category_id = ak.id
      LEFT JOIN AppsheetPhoto ap ON at.photoId = ap.id
      WHERE at.isDeleted = false
      ${conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : ''}
      ORDER BY at.dtTransaction DESC
      ${limit? `LIMIT ? OFFSET ?` : ''}
    `;

    const results = await this.db.$queryRawUnsafe(query, ...params);
    
    return {
      data: results,
      totalRecords,
      totalPages,
      currentPage: page
    };
  }

  async getMonthlyBalanceReport(month: number, year: number) {
    const groupedTransactions = await this.db.appsheetTransaksi.groupBy({
      by: ['categoryId'],
      where: {
        dtTransaction: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0),
        },
      },
      _sum: {
        value: true,
      },
    });
      // Fetch related category data for each group
    const resultWithCategory = await Promise.all(
      groupedTransactions.map(async (group) => {
        const category = await this.db.appsheetKategori.findUnique({
          where: { id: group.categoryId },
        });
        return {
          sum: group._sum.value,
          categoryName: category?.category || 'Unknown',
          type: category?.type || 'Unknown',
        };
      })
    );

    return resultWithCategory;
  }

  async findAllCategories() {
    return this.db.appsheetKategori.findMany();
  }
  async findOneTransaction(id: string) {
    return this.db.appsheetTransaksi.findUnique({
      where: { id },
    });
  }
  async findOneCategory(id: string) {
    return this.db.appsheetKategori.findUnique({
      where: { id },
    });
  }

  async createTransaksi(
    data: CreateAppsheetTransaksiDto,
    file: Express.Multer.File = null,
  ) {
    const { categoryId, ...rest } = data;
    let transaksi;

    if (file) {
      const originalFilePath = file.path;
      const thumbnailFilePath = path.join(
        path.dirname(originalFilePath),
        'small/' + file.filename,
      );
      // Process the image to create a thumbnail
      const sharp = require('sharp');
      await sharp(originalFilePath)
        .resize(200) // Resize to a width of 200px while maintaining aspect ratio
        .toFile(thumbnailFilePath);
      transaksi = {
        ...rest,
        category: {
          connect: {
            id: categoryId,
          },
        },
        photo: {
          create: {
            name: file.filename,
            thumbnailLink: thumbnailFilePath,
            imageLink: originalFilePath,
            downloadLink: null,
          },
        },
      };
    } else {
      transaksi = {
        ...rest,
        category: {
          connect: {
            id: categoryId,
          },
        },
      };
    }
    return await this.db.appsheetTransaksi.create({ data: transaksi });
  }

  async createKategori(data: CreateAppsheetKategoriDto) {
    return await this.db.appsheetKategori.create({
      data,
    });
  }

  async updateTransaksi(
    id: string,
    data: UpdateAppsheetTransaksiDto,
    file: Express.Multer.File,
  ) {
    let transaksi;
    if (file) {
      const originalFilePath = file.path;
      const thumbnailFilePath = path.join(
        path.dirname(originalFilePath),
        'small/' + file.filename,
      );
      // Process the image to create a thumbnail
      const sharp = require('sharp');
      await sharp(originalFilePath)
        .resize(200) // Resize to a width of 200px while maintaining aspect ratio
        .toFile(thumbnailFilePath);
      transaksi = {
        ...data,
        photo: {
          create: {
            name: file.filename,
            imageLink: thumbnailFilePath,
            thumbnailLink: originalFilePath,
          },
        },
      };
    } else {
      transaksi = data;
    }

    return this.db.appsheetTransaksi.update({
      where: { id },
      data: transaksi,
    });
  }

  async updateKategori(id: string, data: UpdateAppsheetKategoriDto) {
    return this.db.appsheetKategori.update({
      where: { id },
      data,
    });
  }

  async updatePhotoData(id: string, data: UpdateAppsheetPhotoDto) {
    return this.db.appsheetPhoto.update({
      where: { id },
      data,
    });
  }

  async batalkanTransaksi(id: string) {
    return this.db.appsheetTransaksi.delete({
      where: { id },
    });
  }

  async removeKategori(id: string) {
    return this.db.appsheetTransaksi.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}
