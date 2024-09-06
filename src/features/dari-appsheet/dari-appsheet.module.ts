import { Module } from '@nestjs/common';

import { DariAppsheetController } from './dari-appsheet.controller';
import { DariAppsheetService } from './dari-appsheet.service';

@Module({
  controllers: [DariAppsheetController],
  providers: [DariAppsheetService],
})
export class DariAppsheetModule {}
