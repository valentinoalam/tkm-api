import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import * as dayjs from 'dayjs';

@Injectable()
export class DariAppsheetService {
  constructor(private db: DatabaseService) {}


  async findAllTransactions() {
    const data = await this.db.appsheetTransaksi.findMany({
      include: {
        category: {
          select: {
            category: true, // Include the category name
          },
        }
      },
    });
    const transactionData = await data.map(({dtTransaction, activity, category, in_out, value, photoUrl}) => ({
      dtTransaction: dayjs(dtTransaction).format('DD/MM/YYYY'), activity, category: category.category, in_out, value, photoUrl
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
