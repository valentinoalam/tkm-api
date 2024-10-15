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
  }