import { Prisma, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateAppsheetTransaksiDto {
    @ApiProperty({
      type: 'integer',
      format: 'int32',
    })
    @IsNotEmpty()
    @IsInt()
    index: number;
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
    dtTransaction: Date;
    @IsNotEmpty()
    @IsString()
    categoryId: string;
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
