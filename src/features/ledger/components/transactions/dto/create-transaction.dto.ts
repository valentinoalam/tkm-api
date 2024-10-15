import { Prisma, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class   CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  activityId: string;
  @IsNotEmpty()
  @IsString()
  accountId: string;
  @ApiProperty({
    enum: TransactionType,
  })
  @IsNotEmpty()
  type: TransactionType;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  refCode?: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dtTrx: Date;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  amount: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  updatedBy?: string | null;
}
