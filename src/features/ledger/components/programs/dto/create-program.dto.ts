import { Prisma, ProgramStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  budget: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  realisation: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  uptake: Prisma.Decimal;
  @ApiProperty({
    enum: ProgramStatus,
  })
  @IsNotEmpty()
  status: ProgramStatus;
}
