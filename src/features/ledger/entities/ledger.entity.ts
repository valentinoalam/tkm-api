import { Period, WeekDay } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../components/accounts/entities';
import { TrialBalance } from '../components/trialBalance/entities';
export class Ledger {
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
  @ApiProperty({
    type: () => Account,
    isArray: true,
    required: false,
  })
  accounts?: Account[];
  @ApiProperty({
    type: () => TrialBalance,
    isArray: true,
    required: false,
  })
  TrialBalance?: TrialBalance[];
}
