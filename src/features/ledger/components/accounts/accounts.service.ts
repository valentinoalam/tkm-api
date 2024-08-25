import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities';
import { DatabaseService } from '@/core/database/database.service';
import * as fakeData from 'src/shared/fake-data'; 

@Injectable()
export class AccountsService {
  constructor(private db: DatabaseService) {}
  
  async createFakeData(): Promise<Account> {
    const fakeAccount = fakeData.fakeAccount(); // Generate 10 fake users
    const isDebit = ['Asset', 'Expense'].includes(fakeAccount.type)
    // Save the fake data to the database using Prisma
    let account = await this.db.account.create({ 
      data: {
        ...fakeAccount,
        isDebit
        } 
    })
    return account;
  }

  async create(dto: CreateAccountDto): Promise<Account> {
    const isDebit = ['Asset', 'Expense'].includes(dto.type)
    return this.db.account.create({
      data:{ 
        ...dto,
        isDebit
      },
    });
  }

  async findAll(): Promise<Account[]> {
    return this.db.account.findMany();
  }

  async findOne(id: string): Promise<Account | null> {
    return this.db.account.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    return this.db.account.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Account> {
    return this.db.account.delete({
      where: { id },
    });
  }
}
