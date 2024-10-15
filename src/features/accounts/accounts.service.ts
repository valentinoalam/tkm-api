import { Injectable } from '@nestjs/common';
import { CreateAccountsDto } from './dto/create-account.dto';
import { UpdateAccountsDto } from './dto/update-account.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(private db: DatabaseService) {}
  async createAccount(data: CreateAccountsDto): Promise<Account> {
    return this.db.account.create({ data });
  }

  async getAccounts(): Promise<Account[]> {
    return this.db.account.findMany();
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.db.account.findUnique({ where: { id } });
  }

  async updateAccount(id: string, data: UpdateAccountsDto): Promise<Account> {
    return this.db.account.update({ where: { id }, data });
  }

  async deleteAccount(id: string): Promise<Account> {
    return this.db.account.delete({ where: { id } });
  }
}
