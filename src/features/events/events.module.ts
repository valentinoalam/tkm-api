import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [ParticipantsModule],
})
export class EventsModule {}
