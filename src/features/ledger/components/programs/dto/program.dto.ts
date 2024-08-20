import { Prisma, ProgramStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProgramDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
}
