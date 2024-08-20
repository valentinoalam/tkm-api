import { Prisma, AccountType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
  startBalance: Prisma.Decimal;
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
}
