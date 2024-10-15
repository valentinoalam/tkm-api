import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class TrialBalanceDetailDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'boolean',
  })
  isDebit: boolean;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  openingBalance: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  closingBalance: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
  })
  account: string;
}
