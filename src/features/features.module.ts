import { GoogleModule } from '@feat/google/google.module';
import { Module } from '@nestjs/common';

// import { JournalModule } from '../features/journal/journal.module';
// import { VendorModule } from '../features/vendor/vendor.module';
// import { MediaModule } from '../features/media/media.module';
import { UsersModule } from '../features/users/users.module';
// import { FilesModule } from 'src/shared/files/files.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@common/guards';
import { AuthModule } from './auth/auth.module';
// import { NotificationModule } from './notification/notification.module';
// import { EventsModule } from './events/events.module';
// import { AssetsModule } from './assets/assets.module';
// import { LedgerModule } from './ledger/ledger.module';
// import { UstadzModule } from './ustadz/ustadz.module';
// import { BankModule } from './bank/bank.module';
import { DariAppsheetModule } from './dari-appsheet/dari-appsheet.module';
import { ItiqafModule } from './itiqaf/itiqaf.module';

@Module({
  imports: [
    // FilesModule,
    AuthModule,
    // VendorModule,
    // MediaModule,
    UsersModule,

    // NotificationModule,
    // EventsModule,
    // AssetsModule,
    // LedgerModule,
    // UstadzModule,
    // BankModule,

    GoogleModule,
    DariAppsheetModule,
    ItiqafModule,
  ],
  exports: [
    // AuthModule,
    // VendorModule,
    // MediaModule,
    // FilesModule,
    UsersModule,
    GoogleModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AtGuard,
    // },
  ],
})
export class FeaturesModule {}
