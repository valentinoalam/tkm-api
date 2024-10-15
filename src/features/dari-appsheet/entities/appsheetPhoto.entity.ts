import { ApiProperty } from '@nestjs/swagger';
import { AppsheetTransaksi } from './appsheetTransaksi.entity';

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