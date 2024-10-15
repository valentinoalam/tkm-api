import { Controller, Get, Query } from '@nestjs/common';
import { FinancialReportsService } from './financial-reports.service';

@Controller('financial-reports')
export class FinancialReportsController {
  constructor(private readonly financialReportsService: FinancialReportsService) {}
  @Get('balance-sheet')
  async getBalanceSheet(@Query('date') date: string) {
    return this.financialReportsService.generateBalanceSheet(new Date(date));
  }

  @Get('income-statement')
  async getIncomeStatement(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.financialReportsService.generateIncomeStatement(new Date(startDate), new Date(endDate));
  }

  @Get('cash-flow-statement')
  async getCashFlowStatement(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.financialReportsService.generateCashFlowStatement(new Date(startDate), new Date(endDate));
  }

  @Get('trial-balance')
  async getTrialBalance(@Query('date') date: string) {
    return this.financialReportsService.generateTrialBalance(new Date(date));
  }
}
