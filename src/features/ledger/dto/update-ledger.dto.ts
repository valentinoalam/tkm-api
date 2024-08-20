import { Period, WeekDay } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLedgerDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    enum: Period,
    required: false,
  })
  @IsOptional()
  reportPeriod?: Period;
  @ApiProperty({
    enum: WeekDay,
    required: false,
  })
  @IsOptional()
  startWeekDay?: WeekDay;
}
