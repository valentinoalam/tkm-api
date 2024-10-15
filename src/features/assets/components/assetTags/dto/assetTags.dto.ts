import { ApiProperty } from '@nestjs/swagger';

export class AssetTagsDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
