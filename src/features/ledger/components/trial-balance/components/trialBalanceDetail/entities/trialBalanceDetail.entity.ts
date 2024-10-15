import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import { TrialBalance } from '../../../entities';

export class TrialBalanceDetail {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  trialBalanceId: string;
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
  @ApiProperty({
    type: () => TrialBalance,
    required: false,
  })
  trialBalance?: TrialBalance;
}
