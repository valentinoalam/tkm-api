import { Controller, Get, Query } from '@nestjs/common';
import { FinancialReportsService } from './financial-reports.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('financial-reports')
export class FinancialReportsController {
  constructor(private readonly financialReportsService: FinancialReportsService) {}
    
  @Get('balance-sheet')
  @ApiOperation({ summary: 'Generate Balance Sheet' })
  @ApiQuery({ name: 'date', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Balance sheet generated successfully' })
  async getBalanceSheet(@Query('date') date: string) {
    const balanceSheetDate = new Date(date);
    return this.financialReportsService.generateBalanceSheet(balanceSheetDate);
  }

  @Get('income-statement')
  @ApiOperation({ summary: 'Generate Income Statement' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Income statement generated successfully' })
  async getIncomeStatement(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.financialReportsService.generateIncomeStatement(start, end);
  }

  @Get('cash-flow-statement')
  async getCashFlowStatement(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.financialReportsService.generateCashFlowStatement(new Date(startDate), new Date(endDate));
  }

  @Get('trial-balance')
  @ApiOperation({ summary: 'Generate Trial Balance' })
  @ApiQuery({ name: 'date', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Trial balance generated successfully' })
  async getTrialBalance(@Query('date') date: string) {
    const balanceDate = new Date(date);
    return this.financialReportsService.generateTrialBalance(balanceDate);
  }

  @Get('trial-balance')
  @ApiOperation({ summary: 'Generate Ledger' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Ledger generated successfully' })
  async getLedger(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.financialReportsService.generateLedger(start, end);
  }
}
