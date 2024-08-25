import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@/features/ledger/components/accounts/entities';

export class BankAccount {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  accountId: string;
  @ApiProperty({
    type: 'string',
  })
  bankName: string;
  @ApiProperty({
    type: 'string',
  })
  accountNumber: string;
  @ApiProperty({
    type: 'string',
  })
  onBehalfOf: string;
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
    type: () => Account,
    required: false,
  })
  account?: Account;
}
