import { ForbiddenException, Injectable } from '@nestjs/common';
import * as fakeData from 'src/shared/fake-data';

import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';
import { BankAccount } from './entities/bankAccount.entity';

import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class BankService {
  constructor(private db: DatabaseService) {}

  async createFakeData(): Promise<BankAccount> {
    const fakebankAccount = fakeData.fakeBankAccount(); // Generate 10 fake users
    const query = await this.db
      .$queryRaw`SELECT id FROM Account ORDER BY RAND() LIMIT 1`;
    const { id } = query[0];
    if (!id) throw new ForbiddenException('please create Account first.');
    // Save the fake data to the database using Prisma
    const bankAccount = await this.db.bankAccount.create({
      data: {
        ...fakebankAccount,
        account: {
          connect: { id }, // Connect to an existing user
        },
      },
    });
    return bankAccount;
  }

  async create(dto: CreateBankAccountDto): Promise<BankAccount> {
    const { accountId, ...accData } = dto;
    return this.db.bankAccount.create({
      data: {
        ...accData,
        account: {
          connect: { id: dto.accountId }, // sets userId of Profile record
        },
      },
    });
  }

  async findAll(): Promise<BankAccount[]> {
    return this.db.bankAccount.findMany();
  }

  async findOne(id: string): Promise<BankAccount | null> {
    return this.db.bankAccount.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateBankAccountDto): Promise<BankAccount> {
    return this.db.bankAccount.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<BankAccount> {
    return this.db.bankAccount.delete({
      where: { id },
    });
  }
}
