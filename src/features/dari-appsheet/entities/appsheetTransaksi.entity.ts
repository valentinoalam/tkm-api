import { ApiProperty } from '@nestjs/swagger';
import { Prisma, TransactionType } from '@prisma/client';
import { AppsheetPhoto } from './AppsheetPhoto.entity';
import { AppsheetKategori } from './appsheetKategori.entity';

export class AppsheetTransaksi {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  appSheetId: string;
  @ApiProperty({
    type: 'string',
  })
  categoryId: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  photoId: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  index: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  timeStamp: Date | null;
  @ApiProperty({
    type: 'string',
  })
  activity: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  value: Prisma.Decimal;
  @ApiProperty({
    type: () => AppsheetPhoto,
    required: false,
    nullable: true,
  })
  photo?: AppsheetPhoto | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtTransaction: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtCreated: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  dtModified: Date | null;
  @ApiProperty({
    type: () => AppsheetKategori,
    required: false,
  })
  category?: AppsheetKategori;
}
