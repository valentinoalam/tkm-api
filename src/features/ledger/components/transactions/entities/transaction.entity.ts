import { Prisma, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionActivity } from './transactionActivity.entity';
import { Vendor } from '@/features/vendor/entities';
import { Program } from '@/features/ledger/components/programs/entities';
import { Media } from '@/features/media/entities';
export class Transaction {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  activityId: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  vendorId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  mediaId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  programId: string | null;
  @ApiProperty({
    enum: TransactionType,
  })
  type: TransactionType;
  @ApiProperty({
    type: 'string',
  })
  description: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  refCode: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtTrx: Date;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  amount: Prisma.Decimal;
  @ApiProperty({
    type: () => TransactionActivity,
    required: true,
  })
  activity?: TransactionActivity;
  @ApiProperty({
    type: () => Vendor,
    required: false,
    nullable: true,
  })
  vendor?: Vendor | null;
  @ApiProperty({
    type: () => Media,
    required: false,
    nullable: true,
  })
  PAP?: Media | null;
  @ApiProperty({
    type: () => Program,
    required: false,
    nullable: true,
  })
  program?: Program | null;
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
    type: 'string',
  })
  createdBy: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  updatedBy: string | null;
}
