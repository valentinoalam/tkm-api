import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Ledger } from '@/features/ledger/entities';
import { TrialBalanceDetail } from '../trialBalanceDetail/entities';

export class TrialBalance {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  ledgerId: string;
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
  @ApiProperty({
    type: () => Ledger,
    required: false,
  })
  ledger?: Ledger;
  @ApiProperty({
    type: () => TrialBalanceDetail,
    isArray: true,
    required: false,
  })
  TrialBalanceDetail?: TrialBalanceDetail[];
}
