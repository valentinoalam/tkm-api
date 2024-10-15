import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  async createBudget(@Body() dto: CreateBudgetDto): Promise<Budget> {
    return this.budgetsService.createBudget(dto);
  }

  @Get()
  async getBudgets(): Promise<Budget[]> {
    return this.budgetsService.getBudgets();
  }

  @Get(':id')
  async getBudgetById(@Param('id') id: string): Promise<Budget | null> {
    return this.budgetsService.getBudgetById(id);
  }

  @Put(':id')
  async updateBudget(@Param('id') id: string, @Body() dto: UpdateBudgetDto): Promise<Budget> {
    return this.budgetsService.updateBudget(id, dto);
  }

  @Delete(':id')
  async deleteBudget(@Param('id') id: string): Promise<Budget> {
    return this.budgetsService.deleteBudget(id);
  }

  @Get('compare-to-actual')
  async compareBudgetToActual(
    @Query('categoryId') categoryId: string,
    @Query('year') year: number,
    @Query('month') month: number
  ) {
    return this.budgetsService.compareBudgetToActual(categoryId, year, month);
  }
}
