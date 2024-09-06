import { Module } from '@nestjs/common';

import { ParticipantsModule } from './components/participants/participants.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [ParticipantsModule],
})
export class EventsModule {}
