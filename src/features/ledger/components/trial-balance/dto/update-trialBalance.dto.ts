import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsOptional } from 'class-validator';

export class UpdateTrialBalanceDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  periodStart?: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  periodEnd?: Date;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  totalDebit?: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  totalCredit?: Prisma.Decimal;
}
