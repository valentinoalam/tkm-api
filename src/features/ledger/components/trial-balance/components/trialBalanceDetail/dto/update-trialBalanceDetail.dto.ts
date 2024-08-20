import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsString } from 'class-validator';

export class UpdateTrialBalanceDetailDto {
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  openingBalance?: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  closingBalance?: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  account?: string;
}
