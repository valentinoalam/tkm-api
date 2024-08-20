import { Prisma, AccountType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    enum: AccountType,
  })
  @IsNotEmpty()
  type: AccountType;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  startBalance: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDecimal()
  currentBalance?: Prisma.Decimal | null;
}
