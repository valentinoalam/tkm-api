import { Module } from '@nestjs/common';
import { ItiqafService } from './itiqaf.service';
import { ItiqafController } from './itiqaf.controller';
import { GoogleService } from '../google/google.service';

@Module({
  controllers: [ItiqafController],
  providers: [ItiqafService, GoogleService],
})
export class ItiqafModule {}
