import { ApiProperty } from '@nestjs/swagger';
import { Prisma, AccountType } from '@prisma/client';

import { TransactionActivity } from '../../transactions/entities';
import { BankAccount } from '@/features/bank/entities';
import { Ledger } from '@/features/ledger/entities';

export class Account {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  parentAccountId: string | null;
  @ApiProperty({
    type: 'string',
  })
  code: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    enum: AccountType,
  })
  type: AccountType;
  @ApiProperty({
    type: 'string',
  })
  description: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  initialBalance: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
    nullable: true,
  })
  currentBalance: Prisma.Decimal | null;
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
    type: () => Account,
    required: false,
    nullable: true,
  })
  parent?: Account | null;
  @ApiProperty({
    type: () => Account,
    isArray: true,
    required: false,
  })
  children?: Account[];
  @ApiProperty({
    type: () => TransactionActivity,
    isArray: true,
    required: false,
  })
  debitEntries?: TransactionActivity[];
  @ApiProperty({
    type: () => TransactionActivity,
    isArray: true,
    required: false,
  })
  creditEntries?: TransactionActivity[];
  @ApiProperty({
    type: () => Ledger,
    isArray: true,
    required: false,
  })
  ledger?: Ledger[];
  @ApiProperty({
    type: () => BankAccount,
    isArray: true,
    required: false,
  })
  BankAccount?: BankAccount[];
}
