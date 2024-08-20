import { Prisma, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
