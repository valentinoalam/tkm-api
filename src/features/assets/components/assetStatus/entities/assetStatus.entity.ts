import { ApiProperty } from '@nestjs/swagger';

import { Asset } from '@/features/assets/entities';

export class AssetStatus {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  assetId: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  availableQty: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  totalQty: number;
  @ApiProperty({
    type: 'string',
  })
  note: string;
  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    type: () => Asset,
    required: false,
  })
  asset?: Asset;
}
