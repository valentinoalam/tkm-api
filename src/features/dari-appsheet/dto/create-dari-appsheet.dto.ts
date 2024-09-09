import { ApiProperty } from '@nestjs/swagger';
import { Prisma, TransactionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsDecimal,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppsheetTransaksiDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  activity: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  value: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: 'string', description: 'Transaction Date in ISO 8601 format' })
  @IsISO8601()
  @Transform(({ value }) => new Date(value).toISOString(), { toClassOnly: true })
  dtTransaction: Date;
  @IsNotEmpty()
  @IsString()
  categoryId: string;
  
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file?: Express.Multer.File;
}

export class CreateAppsheetPhotoDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  thumbnailLink?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imageLink?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  downloadLink?: string | null;
}

export class CreateAppsheetKategoriDto {
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
  category: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  color?: string | null;
}
