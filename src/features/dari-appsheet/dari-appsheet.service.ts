import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import * as dayjs from 'dayjs';

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
      }
    });
  }

  async findAllTransactions(dateStart?: string, dateEnd?: string) {
    const filters: any = {};
    let data= []
    if (dateStart) {
      filters.gte = new Date(dateStart);
    }
    if (dateEnd) {
      filters.lte = new Date(dateEnd);
    }
    const whereClause = dateStart || dateEnd ? { dtTransaction: filters } : {};
    if (whereClause) {
      data = await this.db.appsheetTransaksi.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              category: true, // Include the category name
              type: true
            },
          },
          photo: {
            select: {
              thumbnailLink: true
            }
          }
        },
      });
    } else 
      data = await this.db.appsheetTransaksi.findMany({
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
              thumbnailLink: true
            }
          }
        },
      });
    const transactionData = await data.map(({dtTransaction, activity, category, value, photo}) => ({
      dtTransaction: dayjs(dtTransaction).format('DD MMM'), year: dayjs(dtTransaction).year(), activity, category: category.category, color: category.color, in_out: category.type, value, thumbnailLink: photo? photo.thumbnailLink : null
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
  // async update(id: string, data: UpdateappsheetTransaksiDto) {
  //   return this.db.appsheetTransaksi.update({
  //     where: { id },
  //     data,
  //   });
  // }

  async remove(id: string) {
    return this.db.appsheetTransaksi.delete({
      where: { id },
    });
  }
}
