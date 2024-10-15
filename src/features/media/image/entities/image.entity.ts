import { ApiProperty } from '@nestjs/swagger';

import { Media } from '../../entities';

export class Image {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  mediaId: string | null;
  @ApiProperty({
    type: 'string',
  })
  caption: string;
  @ApiProperty({
    type: 'string',
  })
  url: string;
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
    type: () => Media,
    required: false,
    nullable: true,
  })
  container?: Media | null;
}
