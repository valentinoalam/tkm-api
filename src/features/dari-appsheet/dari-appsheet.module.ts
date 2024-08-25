import { Module } from '@nestjs/common';
import { DariAppsheetService } from './dari-appsheet.service';
import { DariAppsheetController } from './dari-appsheet.controller';

@Module({
  controllers: [DariAppsheetController],
  providers: [DariAppsheetService],
})
export class DariAppsheetModule {}
