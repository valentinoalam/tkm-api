import * as path from 'path';
import * as sharp from 'sharp';

import { Injectable } from '@nestjs/common';

import {
  CreateAppsheetKategoriDto,
  CreateAppsheetTransaksiDto,
} from './dto/create-dari-appsheet.dto';
import {
  UpdateAppsheetKategoriDto,
  UpdateAppsheetPhotoDto,
  UpdateAppsheetTransaksiDto,
} from './dto/update-dari-appsheet.dto';

import { DatabaseService } from '@/core/database/database.service';
import { getPaginatedData, PaginatedResult } from '@/shared/utils/paginate-data.utils';
import { Transaction } from './transaction.interface';
import { AppsheetTransaksi } from './entities';
import { Prisma, TransactionType } from '@prisma/client';

export interface PaginatedTransactionResult extends PaginatedResult<Transaction> {}

const bigIntReplacer = (key, value) => {
  return typeof value === 'bigint' ? value.toString() : value;
};
@Injectable()
export class DariAppsheetService {
  constructor(private db: DatabaseService) {}

  async showAllNotaImage() {
    return this.db.appsheetPhoto.findMany({
      include: {
        transaksi: {
          select: {
            id: true,
            dtTransaction: true,
            activity: true,
            value: true,
            category: {
              select: {
                category: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        transaksi: {
          dtTransaction: 'desc',
        },
      },
    });
  }

  async getChartDataReport() {
    const groupedData = await this.db.$queryRaw`
      SELECT 
        YEAR(at.dtTransaction) AS year,
        MONTH(at.dtTransaction) AS month,
        ak.category AS category,
        ak.type AS in_out,
        ak.color AS color,
        SUM(at.amount) AS sum
      FROM AppsheetTransaksi at
      JOIN AppsheetKategori ak ON at.category_id = ak.id
      WHERE at.isDeleted = false
      GROUP BY 
        YEAR(at.dtTransaction),
        MONTH(at.dtTransaction),
        ak.category,
        ak.type,
        ak.color
      ORDER BY 
        YEAR(at.dtTransaction),
        MONTH(at.dtTransaction);
    `;
  

    const dataParsed = JSON.parse(JSON.stringify(groupedData, bigIntReplacer));
    // Process the data to aggregate sums by month for each year
    const months = Array.from(new Set(dataParsed.map(item=>item.month)));

    const aggregatedData = dataParsed.reduce((acc, { month, sum, category, in_out, color }) => {
      // Ensure category exists in accumulator
      acc[category] = acc[category] || {};
    
      // Utilize a single array per category (no year needed)
      const categoryData = acc[category];
      const monthIndex = months.indexOf(month); // Get month index
    
      // Check if month exists and initialize if necessary
      if (!categoryData[monthIndex]) {
        categoryData[monthIndex] = { in: 0, out: 0 };
      }
      if (in_out === 'Penerimaan') {
        categoryData[monthIndex].in = sum || 0; // month - 1 for zero-based index
      } else if (in_out === 'Pengeluaran') {
        categoryData[monthIndex].out = sum || 0; // month - 1 for zero-based index
      }
      categoryData.color = color
      return acc;
    }, {});
    // Convert the aggregated data into the desired format
    const result = [];
    for (const [category, monthData] of Object.entries(aggregatedData)) {
      const inData = [];
      const outData = [];
  
      for (let month = 0; month < months.length; month++) {
        inData.push(monthData[month]?.in || 0);
        outData.push(monthData[month]?.out || 0);
      }
  
      result.push({ name: `in${category}`, data: inData, group: "Penerimaan", color: monthData["color"] });
      result.push({ name: `out${category}`, data: outData, group: "Pengeluaran", color: monthData["color"]  });
    }
    return {result, months};
  }

  async findAllTransactions(
    dateStart?: string,
    dateEnd?: string,
    page?: number,
    limit?: number,
    search?: string
  ) {
    const params: (string | number)[] = [];
    const conditions: string[] = [];
    
    // Pagination calculations
    const offset = (page - 1) * limit;

    if (search) {
      const searchLike = `%${search}%`; // Use % for SQL LIKE operator
      conditions.push(`(at.activity LIKE ? OR ak.category LIKE ?)`);
      params.push(searchLike, searchLike);
    }

    if (dateStart && dateEnd) {
      conditions.push(`at.dtTransaction BETWEEN ? AND ?`);
      params.push(dateStart, dateEnd);
    } else if (dateEnd) {
      conditions.push(`at.dtTransaction <= ?`);
      params.push(dateEnd);
    } else if (dateStart) {
      conditions.push(`at.dtTransaction >= ?`);
      params.push(dateStart);
    }

    // Query to count total records
    const countQuery = `
      SELECT COUNT(*)
      FROM AppsheetTransaksi at
      JOIN AppsheetKategori ak ON at.category_id = ak.id
      WHERE at.isDeleted = false
      ${conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : ''}
    `;

    // Fetch total records
    const totalRecordsResult = await this.db.$queryRawUnsafe(countQuery, ...params);
    const totalRecords =  Number(totalRecordsResult[0]['COUNT(*)']);
    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    if(limit){ // Adding limit and offset to parameters
      page = page? page : 0;
      params.push(limit, offset);
    }

    const query = `
      SELECT 
        at.id,
        at.dtTransaction,
        at.activity,
        at.category_id AS categoryId,
        ak.category,
        ak.type,
        ak.color,
        at.amount,
        ap.name AS photo,
        ap.downloadLink AS downloadLink
      FROM AppsheetTransaksi at
      JOIN AppsheetKategori ak ON at.category_id = ak.id
      LEFT JOIN AppsheetPhoto ap ON at.photoId = ap.id
      WHERE at.isDeleted = false
      ${conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : ''}
      ORDER BY at.dtTransaction DESC
      ${limit? `LIMIT ? OFFSET ?` : ''}
    `;

    const results = await this.db.$queryRawUnsafe(query, ...params);
    
    return {
      data: results,
      totalRecords,
      totalPages,
      currentPage: page
    };
  }

  setDatePair(date, isEnd) {
    // Create a new Date object with the year and month of dateStart
    if(isEnd)
      return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));// Set the day to 0 to get the last day of the previous month (which is dateStart's month)
    else return  new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  }
  
  toUTC(dateStr) {
    const date = new Date(dateStr);
    date.setUTCHours(24)
    return date;
  }

  async getMonthlyBalanceReport(
    month: number, 
    year: number, 
    dateStart?: any,
    dateEnd?: any,
  ) {
    const yearFilter = year || new Date().getFullYear();
    const monthFilter = month - 1 || new Date().getMonth();

    const startDate = !dateStart && dateEnd? this.setDatePair(new Date(dateEnd), 0) : dateStart ? this.toUTC(dateStart) : new Date(Date.UTC(yearFilter, monthFilter, 1));
    const endDate = dateStart && !dateEnd? this.setDatePair(new Date(dateStart), 1) : dateEnd ? this.toUTC(dateEnd) : new Date(Date.UTC(yearFilter, monthFilter + 1, 0)); // Last day of the month

    const query = `
      SELECT 
        t.category_id,
        c.category AS categoryName,
        c.type AS categoryType,
        SUM(t.amount) AS totalValue
      FROM AppsheetTransaksi t
      JOIN AppsheetKategori c ON t.category_id = c.id
      WHERE t.dtTransaction BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
      GROUP BY t.category_id, c.category, c.type;
    `;

    const resultWithCategory:[] = await this.db.$queryRawUnsafe(query);

    // Processing the result to format debit and credit
    const formattedResult = resultWithCategory.map((row: any) => ({
      categoryName: row.categoryName || 'Unknown',
      debit: row.categoryType === 'Pengeluaran' ? row.totalValue : 0,
      credit: row.categoryType === 'Penerimaan' ? row.totalValue : 0,
    }));

    // Calculate total debit and credit in one step
    const totalDebit = formattedResult.reduce((sum, row) => sum + Number(row.debit), 0);
    const totalCredit = formattedResult.reduce((sum, row) => sum + Number(row.credit), 0);

    return { result: formattedResult, totalDebit, totalCredit };
  }

  async findAllCategories() {
    return this.db.appsheetKategori.findMany();
  }
  async findOneTransaction(id: string) {
    return this.db.appsheetTransaksi.findUnique({
      where: { id },
    });
  }
  async findOneCategory(id: string) {
    return this.db.appsheetKategori.findUnique({
      where: { id },
    });
  }

  async createTransaksi(
    data: CreateAppsheetTransaksiDto,
    file: Express.Multer.File = null,
  ) {
    const { categoryId, ...rest } = data;
    let transaksi;

    if (file) {
      const originalFilePath = path.resolve(file.path);
      const thumbnailFilePath = path.join(
        path.dirname(originalFilePath),
        'small/' + file.filename,
      );
      // Process the image to create a thumbnail
      await sharp(originalFilePath)
        .resize(200) // Resize to a width of 200px while maintaining aspect ratio
        .toFile(thumbnailFilePath);
      transaksi = {
        ...rest,
        category: {
          connect: {
            id: categoryId,
          },
        },
        photo: {
          create: {
            name: file.filename,
            thumbnailLink: thumbnailFilePath,
            imageLink: originalFilePath,
            downloadLink: null,
          },
        },
      };
    } else {
      transaksi = {
        ...rest,
        category: {
          connect: {
            id: categoryId,
          },
        },
      };
    }
    return await this.db.appsheetTransaksi.create({ data: transaksi });
  }

  async createKategori(data: CreateAppsheetKategoriDto) {
    return await this.db.appsheetKategori.create({
      data,
    });
  }

  async updateTransaksi(
    id: string,
    data: UpdateAppsheetTransaksiDto,
    file: Express.Multer.File,
  ) {
    let transaksi;
    if (file) {
      const originalFilePath = path.resolve(file.path);
      const thumbnailFilePath = path.join(
        path.dirname(originalFilePath),
        'small/' + file.filename,
      );
      // Process the image to create a thumbnail
      await sharp(originalFilePath)
        .resize(200) // Resize to a width of 200px while maintaining aspect ratio
        .toFile(thumbnailFilePath);
      transaksi = {
        ...data,
        photo: {
          create: {
            name: file.filename,
            imageLink: thumbnailFilePath,
            thumbnailLink: originalFilePath,
          },
        },
      };
    } else {
      transaksi = data;
    }

    return this.db.appsheetTransaksi.update({
      where: { id },
      data: transaksi,
    });
  }

  async updateKategori(id: string, data: UpdateAppsheetKategoriDto) {
    return this.db.appsheetKategori.update({
      where: { id },
      data,
    });
  }

  async updatePhotoData(id: string, data: UpdateAppsheetPhotoDto) {
    return this.db.appsheetPhoto.update({
      where: { id },
      data,
    });
  }

  async batalkanTransaksi(id: string) {
    return this.db.appsheetTransaksi.delete({
      where: { id },
    });
  }

  async removeKategori(id: string) {
    return this.db.appsheetTransaksi.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }

  async getYearlyFinancialSummary(year: number) {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 0));
    interface MonthlyTransactionSummary {
      month: number;          // The month number (1-12)
      transactionType: TransactionType; // 'Penerimaan' or 'Pengeluaran'
      totalAmount: number;    // The total amount for the month and type
    }

    const query = `
      SELECT 
        MONTH(t.dtTransaction) AS month,
        c.type AS transactionType,
        SUM(t.amount) AS totalAmount
      FROM AppsheetTransaksi t
      JOIN AppsheetKategori c ON t.category_id = c.id
      WHERE t.dtTransaction BETWEEN ? AND ?
      GROUP BY MONTH(t.dtTransaction), c.type
      ORDER BY MONTH(t.dtTransaction), c.type
    `;

    const result = await this.db.$queryRawUnsafe<MonthlyTransactionSummary[]>(query, startDate, endDate);

    const monthlySummary = Array(12).fill(null).map(() => ({ income: 0, expense: 0 }));

    result.forEach((row: any) => {
      const monthIndex = row.month - 1;
      if (row.transactionType === 'Penerimaan') {
        monthlySummary[monthIndex].income += Number(row.totalAmount);
      } else if (row.transactionType === 'Pengeluaran') {
        monthlySummary[monthIndex].expense += Number(row.totalAmount);
      }
    });

    const yearlyTotal = monthlySummary.reduce(
      (acc, month) => ({
        income: acc.income + month.income,
        expense: acc.expense + month.expense,
      }),
      { income: 0, expense: 0 }
    );

    return { monthlySummary, yearlyTotal };
  }

  async getCashFlowStatement(startDate: Date, endDate: Date) {
    const query = `
      SELECT 
        c.type AS transactionType,
        c.category AS categoryName,
        SUM(t.amount) AS totalAmount
      FROM AppsheetTransaksi t
      JOIN AppsheetKategori c ON t.category_id = c.id
      WHERE t.dtTransaction BETWEEN ? AND ?
      GROUP BY c.type, c.category
      ORDER BY c.type, SUM(t.amount) DESC
        `;
    interface CashFlowResult {
      transactionType: string;  // 'Penerimaan' or 'Pengeluaran'
      categoryName: string;     // The name of the category
      totalAmount: number;      // The total amount for the category
    }
    const result = await this.db.$queryRawUnsafe<CashFlowResult[]>(query, startDate, endDate);

    const cashFlowStatement = {
      income: [],
      expense: [],
      totalIncome: 0,
      totalExpense: 0,
      netCashFlow: 0
    };

    result.forEach((row: any) => {
      const item = {
        category: row.categoryName,
        amount: Number(row.totalAmount),
      };

      if (row.transactionType === 'Penerimaan') {
        cashFlowStatement.income.push(item);
        cashFlowStatement.totalIncome += item.amount;
      } else if (row.transactionType === 'Pengeluaran') {
        cashFlowStatement.expense.push(item);
        cashFlowStatement.totalExpense += item.amount;
      }
    });

    cashFlowStatement.netCashFlow = cashFlowStatement.totalIncome - cashFlowStatement.totalExpense;

    return cashFlowStatement;
  }

  async getBudgetAnalysis(year: number, month: number) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));

    const query = `
      SELECT 
        c.id AS categoryId,
        c.category AS categoryName,
        c.budgetAmount,
        SUM(t.amount) AS actualAmount
      FROM AppsheetKategori c
      LEFT JOIN AppsheetTransaksi t ON c.id = t.category_id AND t.dtTransaction BETWEEN ? AND ?
      WHERE c.type = 'Pengeluaran'
      GROUP BY c.id, c.category, c.budgetAmount
    `;

    const result = await this.db.$queryRawUnsafe<any[]>(query, startDate, endDate);

    return result.map((row: any) => ({
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      budgetAmount: Number(row.budgetAmount) || 0,
      actualAmount: Number(row.actualAmount) || 0,
      variance: (Number(row.budgetAmount) || 0) - (Number(row.actualAmount) || 0),
    }));
  }

  async getAccountBalances(date: Date) {
    const query = `
    SELECT 
      a.id AS accountId,
      a.name AS accountName,
      a.initialBalance,
      COALESCE(SUM(
        CASE 
          WHEN ak.type = 'Penerimaan' THEN t.amount
          WHEN ak.type = 'Pengeluaran' THEN -t.amount
          ELSE 0
        END
      ), 0) AS netTransactions
    FROM Account a
    LEFT JOIN AppsheetTransaksi t ON a.id = t.accountId AND t.dtTransaction <= ?
    LEFT JOIN AppsheetKategori ak ON t.category_id = ak.id
    GROUP BY a.id, a.name, a.initialBalance
  `;

    const result = await this.db.$queryRawUnsafe<any[]>(query, date);

    return result.map((row: any) => ({
      accountId: row.accountId,
      accountName: row.accountName,
      balance: Number(row.initialBalance) + Number(row.netTransactions || 0),
    }));
  }

  async getFinancialRatios(startDate: Date, endDate: Date) {
    const cashFlowStatement = await this.getCashFlowStatement(startDate, endDate);
    const accountBalances = await this.getAccountBalances(endDate);

    const totalAssets = accountBalances.reduce((sum, account) => sum + account.balance, 0);
    const totalLiabilities = 0; // Assuming no liabilities for simplicity, adjust as needed

    const ratios = {
      currentRatio: totalAssets / (totalLiabilities || 1),
      debtToEquityRatio: totalLiabilities / (totalAssets - totalLiabilities || 1),
      profitMargin: (cashFlowStatement.netCashFlow / cashFlowStatement.totalIncome) * 100,
      returnOnAssets: (cashFlowStatement.netCashFlow / totalAssets) * 100,
    };

    return ratios;
  }

  async createBudget(categoryId: string, amount: number, year: number, month: number) {
    return this.db.budget.upsert({
      where: {
        categoryId_year_month: {
          categoryId,
          year,
          month,
        },
      },
      update: { amount },
      create: { categoryId, amount, year, month },
    });
  }

  async getTransactionTrends(startDate: Date, endDate: Date, interval: 'day' | 'week' | 'month') {
    let groupBy, dateFormat;
    switch (interval) {
      case 'day':
        groupBy = 'DATE(t.dtTransaction)';
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupBy = 'YEARWEEK(t.dtTransaction)';
        dateFormat = '%x-W%v';
        break;
      case 'month':
        groupBy = 'DATE_FORMAT(t.dtTransaction, "%Y-%m")';
        dateFormat = '%Y-%m';
        break;
    }

    const query = `
      SELECT 
        ${groupBy} AS date,
        DATE_FORMAT(t.dtTransaction, '${dateFormat}') AS formattedDate,
        c.type AS transactionType,
        SUM(t.amount) AS totalAmount
      FROM AppsheetTransaksi t
      JOIN AppsheetKategori c ON t.category_id = c.id
      WHERE t.dtTransaction BETWEEN ? AND ?
      GROUP BY ${groupBy}, c.type
      ORDER BY ${groupBy}, c.type
    `;

    const result = await this.db.$queryRawUnsafe<any[]>(query, startDate, endDate);

    const trends: {
      [key: string]: { income: number; expense: number };
    } = {};
    result.forEach((row: any) => {
      if (!trends[row.formattedDate]) {
        trends[row.formattedDate] = { income: 0, expense: 0 };
      }
      if (row.transactionType === 'Penerimaan') {
        trends[row.formattedDate].income += Number(row.totalAmount);
      } else if (row.transactionType === 'Pengeluaran') {
        trends[row.formattedDate].expense += Number(row.totalAmount);
      }
    });

    return Object.entries(trends).map(([date, data]) => ({
      date,
      income: data.income,
      expense: data.expense,
      netCashFlow: data.income - data.expense,
    }));
  }

  async generateTrialBalance(balanceDate: Date) {
    const query = `
      SELECT 
        a.id AS accountId,
        a.code AS accountCode,
        a.name AS accountName,
        a.type AS accountType,
        a.isDebit,
        a.initialBalance,
        COALESCE(SUM(CASE 
          WHEN ta.debitAccountId = a.id THEN ta.amount 
          WHEN ta.creditAccountId = a.id THEN -ta.amount 
          ELSE 0 
        END), 0) AS netMovement
      FROM Account a
      LEFT JOIN TransactionActivity ta ON (ta.debitAccountId = a.id OR ta.creditAccountId = a.id)
        AND ta.dtTransaction <= ?
      GROUP BY a.id, a.code, a.name, a.type, a.isDebit, a.initialBalance
    `;

    const result = await this.db.$queryRawUnsafe<any[]>(query, balanceDate);

    return result.map(row => ({
      accountId: row.accountId,
      accountCode: row.accountCode,
      accountName: row.accountName,
      accountType: row.accountType,
      isDebit: row.isDebit,
      initialBalance: Number(row.initialBalance) || 0,
      netMovement: Number(row.netMovement),
      endingBalance: (Number(row.initialBalance) || 0) + Number(row.netMovement)
    }));
  }

  async generateBalanceSheet(balanceSheetDate: Date) {
    const trialBalance = await this.generateTrialBalance(balanceSheetDate);

    const balanceSheet = {
      assets: [],
      liabilities: [],
      equity: [],
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0
    };

    trialBalance.forEach(account => {
      const amount = account.endingBalance * (account.isDebit ? 1 : -1);
      
      switch (account.accountType) {
        case 'ASSET':
          balanceSheet.assets.push({ ...account, amount });
          balanceSheet.totalAssets += amount;
          break;
        case 'LIABILITY':
          balanceSheet.liabilities.push({ ...account, amount });
          balanceSheet.totalLiabilities += amount;
          break;
        case 'EQUITY':
          balanceSheet.equity.push({ ...account, amount });
          balanceSheet.totalEquity += amount;
          break;
      }
    });

    return balanceSheet;
  }

  async generateIncomeStatement(startDate: Date, endDate: Date) {
    const query = `
      SELECT 
        a.id AS accountId,
        a.code AS accountCode,
        a.name AS accountName,
        a.type AS accountType,
        a.isDebit,
        COALESCE(SUM(CASE 
          WHEN ta.debitAccountId = a.id THEN ta.amount 
          WHEN ta.creditAccountId = a.id THEN -ta.amount 
          ELSE 0 
        END), 0) AS netAmount
      FROM Account a
      LEFT JOIN TransactionActivity ta ON (ta.debitAccountId = a.id OR ta.creditAccountId = a.id)
        AND ta.dtTransaction BETWEEN ? AND ?
      WHERE a.type IN ('REVENUE', 'EXPENSE')
      GROUP BY a.id, a.code, a.name, a.type, a.isDebit
    `;

    const result = await this.db.$queryRawUnsafe<any[]>(query, startDate, endDate);

    const incomeStatement = {
      revenue: [],
      expenses: [],
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0
    };

    result.forEach(account => {
      const amount = Number(account.netAmount) * (account.isDebit ? 1 : -1);
      
      if (account.accountType === 'REVENUE') {
        incomeStatement.revenue.push({ ...account, amount });
        incomeStatement.totalRevenue += amount;
      } else if (account.accountType === 'EXPENSE') {
        incomeStatement.expenses.push({ ...account, amount });
        incomeStatement.totalExpenses += amount;
      }
    });

    incomeStatement.netIncome = incomeStatement.totalRevenue - incomeStatement.totalExpenses;

    return incomeStatement;
  }
}
