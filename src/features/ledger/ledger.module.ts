import { Module } from '@nestjs/common';

import { AccountsModule } from './components/accounts/accounts.module';
import { ProgramsModule } from './components/programs/programs.module';
import { TransactionsModule } from './components/transactions/transactions.module';
import { TrialBalanceService } from './components/trial-balance/trial-balance.service';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';

@Module({
  controllers: [LedgerController],
  providers: [LedgerService, TrialBalanceService],
  imports: [AccountsModule, TransactionsModule, ProgramsModule],
})
export class LedgerModule {}
