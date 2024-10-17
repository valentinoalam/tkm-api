import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(private db: DatabaseService) {}

  async createBudget(data: CreateBudgetDto): Promise<Budget> {
    return this.db.budget.create({ data });
  }

  async getBudgets(): Promise<Budget[]> {
    return this.db.budget.findMany();
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    return this.db.budget.findUnique({ where: { id } });
  }

  async updateBudget(id: string, data: UpdateBudgetDto): Promise<Budget> {
    return this.db.budget.update({ where: { id }, data });
  }

  async deleteBudget(id: string): Promise<Budget> {
    return this.db.budget.delete({ where: { id } });
  }

  async compareBudgetToActual(categoryId: string, year: number, month: number) {
    // Get the budget for the specified category, year, and month
    const budget = await this.db.budget.findFirst({
      where: {
        categoryId,
        year,
        month,
      },
    });

    if (!budget) {
      throw new Error(`No budget found for category ${categoryId} in ${year}-${month}`);
    }

    // Calculate the start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get the actual spending for the specified category and date range
    const actualSpending = await this.db.appsheetTransaksi.aggregate({
      where: {
        categoryId,
        dtTransaction: {
          gte: startDate,
          lte: endDate,
        },
        category: {
          type: 'Pengeluaran', // Assuming 'Pengeluaran' means 'Expense'
        },
      },
      _sum: {
        value: true,
      },
    });

    const actualAmount = actualSpending._sum.value?.toNumber() || 0;
    const budgetedAmount = budget.amount.toNumber();

    // Calculate the difference and percentage
    const difference = budgetedAmount - actualAmount;
    const percentageUsed = (actualAmount / budgetedAmount) * 100;

    return {
      category: await this.db.appsheetKategori.findUnique({ where: { id: categoryId } }),
      year,
      month,
      budgeted: budgetedAmount,
      actual: actualAmount,
      difference,
      percentageUsed,
      status: this.getBudgetStatus(percentageUsed),
    };
  }

  private getBudgetStatus(percentageUsed: number): string {
    if (percentageUsed <= 80) return 'Under Budget';
    if (percentageUsed <= 100) return 'On Track';
    return 'Over Budget';
  }
}
