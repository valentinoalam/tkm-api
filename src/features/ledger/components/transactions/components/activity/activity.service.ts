import { Injectable } from '@nestjs/common';
import * as fakeData from 'src/shared/fake-data'; 
import { TransactionActivity } from './entities';
import { CreateTransactionActivityDto, UpdateTransactionActivityDto } from './dto';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class ActivityService {
  constructor(private db: DatabaseService) {}
  async createFakeData(): Promise<TransactionActivity> {
    const fakeEntry = fakeData.fakeTransactionActivity(); // Generate 10 fake users
    // Save the fake data to the database using Prisma
    let entry = await this.db.transactionActivity.create({ 
      data: { ...fakeEntry }, 
      
    })
    return entry;
  }

  async create(dto: CreateTransactionActivityDto): Promise<TransactionActivity> {
    return this.db.transactionActivity.create({
      data: { ...dto},
    });
  }

  async findAll(): Promise<TransactionActivity[]> {
    return this.db.transactionActivity.findMany();
  }

  async findOne(id: string): Promise<TransactionActivity | null> {
    return this.db.transactionActivity.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTransactionActivityDto): Promise<TransactionActivity> {
    return this.db.transactionActivity.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<TransactionActivity> {
    return this.db.transactionActivity.delete({
      where: { id },
    });
  }
}
