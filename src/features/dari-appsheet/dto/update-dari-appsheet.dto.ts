import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Prisma, TransactionType } from '@prisma/client';
import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateAppsheetKategoriDto } from './create-dari-appsheet.dto';

export class UpdateAppsheetTransaksiDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  appSheetId?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  @IsOptional()
  @IsInt()
  index?: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  timeStamp?: Date | null;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  activity?: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  value?: Prisma.Decimal;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dtTransaction?: Date;
}

export class UpdateAppsheetKategoriDto extends PartialType(CreateAppsheetKategoriDto) {}

export class UpdateAppsheetPhotoDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
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
