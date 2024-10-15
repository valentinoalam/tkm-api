import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(private db: DatabaseService) {}
  async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    const { activityId, accountId, ...rest} = data;
    return this.db.transaction.create({ data: {
        ...rest, 
        account: {
          connect: { id: accountId }
        },
        activity: {
          connect: { id: activityId }
        }
      } });
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.db.transaction.findMany();
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.db.transaction.findUnique({ where: { id } });
  }

  async updateTransaction(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    return this.db.transaction.update({ where: { id }, data });
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    return this.db.transaction.delete({ where: { id } });
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return this.db.transaction.findMany({
      where: {
        dtTrx: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    return this.db.transaction.findMany({
      where: {
        accountId,
      },
    });
  }

  async reconcileTransactions(accountId: string, startDate: Date, endDate: Date) {
    // Implement reconciliation logic
  }
}
