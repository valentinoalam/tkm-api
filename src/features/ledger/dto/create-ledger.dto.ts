import { ApiProperty } from '@nestjs/swagger';
import { Period, WeekDay } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLedgerDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({
    enum: Period,
  })
  @IsNotEmpty()
  reportPeriod: Period;
  @ApiProperty({
    enum: WeekDay,
  })
  @IsNotEmpty()
  startWeekDay: WeekDay;
}
