import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CategoryModule } from './components/category/category.module';
import { ActivityModule } from './components/activity/activity.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [CategoryModule, ActivityModule],
})
export class TransactionsModule {}
