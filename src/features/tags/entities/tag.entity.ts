import { ApiProperty } from '@nestjs/swagger';

import { AssetTags } from '@/features/assets/components/assetTags/entities';

export class Tag {
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
  })
  description: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    type: () => AssetTags,
    isArray: true,
    required: false,
  })
  assetTags?: AssetTags[];
}
