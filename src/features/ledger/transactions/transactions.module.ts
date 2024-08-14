import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [CategoryModule],
})
export class TransactionsModule {}
