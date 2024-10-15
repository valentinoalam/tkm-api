import { ApiProperty } from '@nestjs/swagger';

import { Asset } from '@/features/assets/entities';
import { Tag } from '@/features/tags/entities';

export class AssetTags {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  assetId: string;
  @ApiProperty({
    type: 'string',
  })
  tagId: string;
  @ApiProperty({
    type: () => Asset,
    required: false,
  })
  asset?: Asset;
  @ApiProperty({
    type: () => Tag,
    required: false,
  })
  tag?: Tag;
}
