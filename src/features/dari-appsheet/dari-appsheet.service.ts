import { Injectable, Query } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { UpdateAppsheetKategoriDto, UpdateAppsheetPhotoDto, UpdateAppsheetTransaksiDto } from './dto/update-dari-appsheet.dto';
import { CreateAppsheetKategoriDto, CreateAppsheetTransaksiDto } from './dto/create-dari-appsheet.dto';
import path from 'path';
import { getPaginatedData } from '@/shared/helper';
@Injectable()
export class DariAppsheetService {

  constructor(private db: DatabaseService) {}

  async showAllNotaImage() {
    return this.db.appsheetPhoto.findMany({
      include: {
        transaksi: {
          select:{
            id: true,
            dtTransaction: true,
            activity: true,
            value: true,
            category: {
              select:{
                category: true,
                type: true
              }
            },
          }
        }
      },
      orderBy: {
        transaksi: {
          dtTransaction: 'desc',
        }
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
            color: true
          },
        },
      },
      orderBy: {
        dtTransaction: 'desc',
      },
    });
    
    const transactionData = await data.map(({dtTransaction, category, value}) => ({
      dtTransaction, category: category.category, color: category.color, in_out: category.type, value,
    }))
    return transactionData;
  }
  async findAllTransactions(dateStart?: string, dateEnd?: string, page?: number, limit?: number) {
    const filters: any = {};
    if (dateStart) {
      filters.gte = new Date(dateStart);
    }
    if (dateEnd) {
      filters.lte = new Date(dateEnd);
    }
    const whereClause = dateStart || dateEnd ? { dtTransaction: filters, isDeleted: false } : {isDeleted: false};
    const query = {
      where: whereClause,
      include: {
        category: {
          select: {
            category: true, // Include the category name
            type: true,
            color: true
          },
        },
        photo: {
          select: {
            name: true,
            downloadLink: true
          }
        }
      },
      orderBy: {
        dtTransaction: 'desc',
      },
    }
    
    const data = await getPaginatedData(this.db, 'appsheetTransaksi', query, page, limit);
    
    data.data = await data.data.map(({id, dtTransaction, activity, category, value, photo}) => ({
      id, dtTransaction, activity, category: category.category, color: category.color, in_out: category.type, value, photo: photo? photo.name : null, downloadLink: photo? photo.downloadLink : null
    }))
    return data;
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
  
  async createTransaksi(data: CreateAppsheetTransaksiDto, file: Express.Multer.File = null) {
    const {categoryId, ...rest} = data;
    let transaksi;
   
    if (file) {
      const originalFilePath = file.path;
      const thumbnailFilePath = path.join(path.dirname(originalFilePath), 'small/' + file.filename);
      // Process the image to create a thumbnail
      const sharp = require('sharp');
      await sharp(originalFilePath)
        .resize(200) // Resize to a width of 200px while maintaining aspect ratio
        .toFile(thumbnailFilePath);
      transaksi = {
        ...rest,
        category: {
          connect: {
            id: categoryId
          }
        },
        photo: {
          create: {
            name: file.filename,
            thumbnailLink: thumbnailFilePath,
            imageLink: originalFilePath,
            downloadLink: null
          }
        }
      }
    } else {
      transaksi = {
        ...rest,
        category: {
          connect: {
            id: categoryId
          }
        },
      }
    }
    return await this.db.appsheetTransaksi.create({ data: transaksi });
  }

  async createKategori(data: CreateAppsheetKategoriDto) {
    return await this.db.appsheetKategori.create({
      data
    });
  }

  async updateTransaksi(id: string, data: UpdateAppsheetTransaksiDto, file: Express.Multer.File) {
    let transaksi;
    if (file) {
      const originalFilePath = file.path;
      const thumbnailFilePath = path.join(path.dirname(originalFilePath), 'small/' + file.filename);
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
            thumbnailLink: originalFilePath
          },
        },
      }
    } else {
      transaksi = data
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
        isDeleted: true
      }
    });
  }

}
