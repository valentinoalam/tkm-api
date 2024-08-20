import { Prisma, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({
    enum: TransactionType,
    required: false,
  })
  @IsOptional()
  type?: TransactionType;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
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
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dtTrx?: Date;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  amount?: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  updatedBy?: string | null;
}
