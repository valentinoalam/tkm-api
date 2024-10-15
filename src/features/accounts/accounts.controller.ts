import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountsDto } from './dto/create-account.dto';
import { UpdateAccountsDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() dto: CreateAccountsDto): Promise<Account> {
    return this.accountsService.createAccount(dto);
  }

  @Get()
  async getAccounts(): Promise<Account[]> {
    return this.accountsService.getAccounts();
  }

  @Get(':id')
  async getAccountById(@Param('id') id: string): Promise<Account | null> {
    return this.accountsService.getAccountById(id);
  }

  @Patch(':id')
  async updateAccount(@Param('id') id: string, @Body() dto: UpdateAccountsDto): Promise<Account> {
    return this.accountsService.updateAccount(id, dto);
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: string): Promise<Account> {
    return this.accountsService.deleteAccount(id);
  }
}
