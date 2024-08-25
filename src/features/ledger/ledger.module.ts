import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { AccountsModule } from './components/accounts/accounts.module';
import { TransactionsModule } from './components/transactions/transactions.module';
import { ProgramsModule } from './components/programs/programs.module';
import { TrialBalanceService } from './components/trial-balance/trial-balance.service';

@Module({
  controllers: [LedgerController],
  providers: [LedgerService, TrialBalanceService],
  imports: [AccountsModule, TransactionsModule, ProgramsModule],
})
export class LedgerModule {}
