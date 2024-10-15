import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.createTransaction(dto);
  }

  @Get()
  async getTransactions(): Promise<Transaction[]> {
    return this.transactionsService.getTransactions();
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<Transaction | null> {
    return this.transactionsService.getTransactionById(id);
  }

  @Patch(':id')
  async updateTransaction(@Param('id') id: string, @Body() dto: UpdateTransactionDto): Promise<Transaction> {
    return this.transactionsService.updateTransaction(id, dto);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.deleteTransaction(id);
  }

  @Get('by-date-range')
  async getTransactionsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<Transaction[]> {
    return this.transactionsService.getTransactionsByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('by-account/:accountId')
  async getTransactionsByAccount(@Param('accountId') accountId: string): Promise<Transaction[]> {
    return this.transactionsService.getTransactionsByAccount(accountId);
  }

  @Post('reconcile')
  async reconcileTransactions(
    @Body('accountId') accountId: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string
  ) {
    return this.transactionsService.reconcileTransactions(accountId, new Date(startDate), new Date(endDate));
  }
}
