import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class AppsheetKategori {
    @ApiProperty({
      type: 'string',
    })
    id: string;
    @ApiProperty({
      enum: TransactionType,
    })
    type: TransactionType;
    @ApiProperty({
      type: 'string',
    })
    category: string;
    @ApiProperty({
      type: 'string',
      nullable: true,
    })
    color: string | null;
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
      type: () => AppsheetTransaksi,
      isArray: true,
      required: false,
    })
    transaksi?: AppsheetTransaksi[];
  }
  
export class AppsheetPhoto {
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
      nullable: true,
    })
    thumbnailLink: string | null;
    @ApiProperty({
      type: 'string',
      nullable: true,
    })
    imageLink: string | null;
    @ApiProperty({
      type: 'string',
      nullable: true,
    })
    downloadLink: string | null;
    @ApiProperty({
      type: () => AppsheetTransaksi,
      required: false,
      nullable: true,
    })
    transaksi?: AppsheetTransaksi | null;
  }
  
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