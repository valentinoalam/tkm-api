import { Module } from '@nestjs/common';

import { EventsModule } from './events/events.module';
import { UstadzController } from './ustadz.controller';
import { UstadzService } from './ustadz.service';

@Module({
  controllers: [UstadzController],
  providers: [UstadzService],
  imports: [EventsModule],
})
export class UstadzModule {}
