import { Prisma, ProgramStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional } from 'class-validator';

export class UpdateProgramDto {
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  budget?: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  realisation?: Prisma.Decimal;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  uptake?: Prisma.Decimal;
  @ApiProperty({
    enum: ProgramStatus,
    required: false,
  })
  @IsOptional()
  status?: ProgramStatus;
}
