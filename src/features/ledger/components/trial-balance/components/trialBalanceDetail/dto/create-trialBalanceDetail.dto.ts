import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrialBalanceDetailDto {
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  openingBalance: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  closingBalance: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  account: string;
}
