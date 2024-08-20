import { Account } from './../accounts/entities/account.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import * as fakeData from 'src/shared/fake-data'; 
import { Transaction } from './entities/transaction.entity';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class TransactionsService {
  constructor(private db: DatabaseService) {}

  // create(createTransactionInput: CreateEntryDto): Transaction {
  //   const transaction: Transaction = {
  //     id: Date.now().toString(),
  //     ...createTransactionInput,
  //     createdAt: new Date(),
  //     JournalId: '',
  //     vendorId: '',
  //     type: 'DEBIT',
  //     amount: 0,
  //     description: '',
  //     reference: '',
  //     dtTrx: undefined,
  //     notaUrl: '',
  //     updatedAt: undefined,
  //     createdBy: '',
  //     updatedBy: '',
  //   };
  //   this.journalEntries.push(transaction);
  //   return transaction;
  // }
  async createFakeData(): Promise<Transaction> {
    const fakeEntry = fakeData.fakeTransaction(); // Generate 10 fake users
    let {accountId, ...rest} = fakeEntry
    const query = await this.db.$queryRaw`SELECT id FROM TransactionActivity ORDER BY RAND() LIMIT 1`;
    const { id } = query[0]
    if (!id) throw new ForbiddenException('please provide journal first.');
    // Save the fake data to the database using Prisma
    let entry = await this.db.transaction.create({ 
      data: {
        ...rest,
        activity: {
          connect: {id} // Connect to an existing user
        }
      }, 
      
    })
    return entry;
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    return this.db.transaction.create({
      data: { ...dto },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.db.transaction.findMany();
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.db.transaction.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    return this.db.transaction.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Transaction> {
    return this.db.transaction.delete({
      where: { id },
    });
  }
}
