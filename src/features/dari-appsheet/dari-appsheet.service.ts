import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { UpdateAppsheetKategoriDto, UpdateAppsheetPhotoDto, UpdateAppsheetTransaksiDto } from './dto/update-dari-appsheet.dto';
import { CreateAppsheetKategoriDto, CreateAppsheetTransaksiDto } from './dto/create-dari-appsheet.dto';
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

  async findAllTransactions(dateStart?: string, dateEnd?: string) {
    const filters: any = {};
    if (dateStart) {
      filters.gte = new Date(dateStart);
    }
    if (dateEnd) {
      filters.lte = new Date(dateEnd);
    }
    const whereClause = dateStart || dateEnd ? { dtTransaction: filters } : {};
    const data = await this.db.appsheetTransaksi.findMany({
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
    });
    
    const transactionData = await data.map(({dtTransaction, activity, category, value, photo}) => ({
      dtTransaction, activity, category: category.category, color: category.color, in_out: category.type, value, photo: photo? photo.name : null, downloadLink: photo? photo.downloadLink : null
    }))
    return transactionData;
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
  async createTransaksi(data: CreateAppsheetTransaksiDto) {
    const {categoryId, photoId, ...rest} = data;

    return await this.db.appsheetTransaksi.create({
      data:{
        ...rest,
        category: {
          connect: {
            id: categoryId
          }
        },
        photo: {
          connect: {
            id: photoId? photoId : null
          }
        }
      }
    });
  }

  async createKategori(data: CreateAppsheetKategoriDto) {
    return await this.db.appsheetKategori.create({
      data
    });
  }

  async updateTransaksi(id: string, data: UpdateAppsheetTransaksiDto) {
    return this.db.appsheetTransaksi.update({
      where: { id },
      data,
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
    return this.db.appsheetTransaksi.delete({
      where: { id },
    });
  }

}
