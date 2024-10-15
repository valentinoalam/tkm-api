import { ApiProperty } from '@nestjs/swagger';
import { Period, WeekDay } from '@prisma/client';

export class LedgerDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  description: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    enum: Period,
  })
  reportPeriod: Period;
  @ApiProperty({
    enum: WeekDay,
  })
  startWeekDay: WeekDay;
}
