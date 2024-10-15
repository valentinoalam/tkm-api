import { Prisma, ProgramStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../transactions/entities';

export class Program {
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
    type: 'number',
    format: 'double',
  })
  budget: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  realisation: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  uptake: Prisma.Decimal;
  @ApiProperty({
    enum: ProgramStatus,
  })
  status: ProgramStatus;
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
    type: () => Transaction,
    isArray: true,
    required: false,
  })
  transaction?: Transaction[];
}
