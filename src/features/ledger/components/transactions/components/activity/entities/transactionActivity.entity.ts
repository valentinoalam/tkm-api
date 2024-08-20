import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@/features/ledger/components/accounts/entities';
import { TransactionCategory } from '../../category/entities';
import { Transaction } from '../../../entities/transaction.entity';

export class TransactionActivity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  categoryId: string | null;
  @ApiProperty({
    type: 'string',
  })
  debitAccountId: string;
  @ApiProperty({
    type: 'string',
  })
  creditAccountId: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: () => Account,
    required: false,
  })
  debitAccount?: Account;
  @ApiProperty({
    type: () => Account,
    required: false,
  })
  creditAccount?: Account;
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
    type: () => TransactionCategory,
    required: false,
    nullable: true,
  })
  category?: TransactionCategory | null;
  @ApiProperty({
    type: () => Transaction,
    isArray: true,
    required: false,
  })
  Transaction?: Transaction[];
}
