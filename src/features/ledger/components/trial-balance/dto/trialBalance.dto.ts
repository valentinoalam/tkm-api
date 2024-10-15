import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class TrialBalanceDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  periodStart: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  periodEnd: Date;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  totalDebit: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  totalCredit: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
