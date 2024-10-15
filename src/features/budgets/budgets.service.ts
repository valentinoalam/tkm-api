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
    // Implement budget vs actual comparison logic
  }
}
