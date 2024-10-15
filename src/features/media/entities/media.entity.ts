import { ApiProperty } from '@nestjs/swagger';

import { Image } from '../image/entities/image.entity';

import { Transaction } from '@/features/ledger/components/transactions/entities/transaction.entity';

export class Media {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: () => Image,
    isArray: true,
    required: false,
  })
  img?: Image[];
  @ApiProperty({
    type: () => Transaction,
    isArray: true,
    required: false,
  })
  Transaction?: Transaction[];
}
