import { Injectable } from '@nestjs/common';
import { CreateTransactionCategoryDto, UpdateTransactionCategoryDto } from './dto';
import { TransactionCategory } from './entities';
import { DatabaseService } from '@/core/database/database.service';
import * as fakeData from 'src/shared/fake-data'; 

@Injectable()
export class CategoryService {
  constructor(private db: DatabaseService) {}
  async createFakeData(): Promise<TransactionCategory> {
    const fakeEntry = fakeData.fakeTransactionCategory(); // Generate 10 fake users
    // Save the fake data to the database using Prisma
    let entry = await this.db.transactionCategory.create({ 
      data: { ...fakeEntry }, 
      
    })
    return entry;
  }

  async create(dto: CreateTransactionCategoryDto): Promise<TransactionCategory> {
    return this.db.transactionCategory.create({
      data: { ...dto},
    });
  }

  async findAll(): Promise<TransactionCategory[]> {
    return this.db.transactionCategory.findMany();
  }

  async findOne(id: string): Promise<TransactionCategory | null> {
    return this.db.transactionCategory.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTransactionCategoryDto): Promise<TransactionCategory> {
    return this.db.transactionCategory.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<TransactionCategory> {
    return this.db.transactionCategory.delete({
      where: { id },
    });
  }
}
