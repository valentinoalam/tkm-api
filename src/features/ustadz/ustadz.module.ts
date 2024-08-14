import { Module } from '@nestjs/common';
import { UstadzService } from './ustadz.service';
import { UstadzController } from './ustadz.controller';
import { EventsModule } from './events/events.module';

@Module({
  controllers: [UstadzController],
  providers: [UstadzService],
  imports: [EventsModule],
})
export class UstadzModule {}
