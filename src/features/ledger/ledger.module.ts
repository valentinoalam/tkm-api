import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  controllers: [LedgerController],
  providers: [LedgerService],
  imports: [AccountsModule, TransactionsModule],
})
export class LedgerModule {}
