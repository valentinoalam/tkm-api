import { GoogleModule } from '@feat/google/google.module';
import { Module } from '@nestjs/common';

import { VendorModule } from '../features/vendor/vendor.module';
import { MediaModule } from '../features/media/media.module';
// import { FilesModule } from 'src/shared/files/files.module';
import { EventsModule } from './events/events.module';
import { AssetsModule } from './assets/assets.module';
import { LedgerModule } from './ledger/ledger.module';
import { UstadzModule } from './ustadz/ustadz.module';
import { BankModule } from './bank/bank.module';
import { DariAppsheetModule } from './dari-appsheet/dari-appsheet.module';
import { ItiqafModule } from './itiqaf/itiqaf.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AccountsModule } from './accounts/accounts.module';
import { FinancialReportsModule } from './financial-reports/financial-reports.module';
import { BudgetsModule } from './budgets/budgets.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    // FilesModule,
    EventsModule,
    AssetsModule,
    LedgerModule,
    UstadzModule,
    BankModule,
    GoogleModule,
    DariAppsheetModule,
    ItiqafModule,
    NotificationsModule,
    AccountsModule,
    FinancialReportsModule,
    BudgetsModule,
    RoleModule,
    VendorModule,
    MediaModule,
  ],
  exports: [
    EventsModule,
    AssetsModule,
    LedgerModule,
    UstadzModule,
    BankModule,
    GoogleModule,
    DariAppsheetModule,
    ItiqafModule,
    NotificationsModule,
    AccountsModule,
    FinancialReportsModule,
    BudgetsModule,
    RoleModule,
    VendorModule,
    MediaModule,
    GoogleModule,
  ],
  providers: [],
})
export class FeaturesModule {}
