import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AssetTagsAssetIdTagIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  assetId: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  tagId: string;
}

@ApiExtraModels(AssetTagsAssetIdTagIdUniqueInputDto)
export class ConnectAssetTagsDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string;
  @ApiProperty({
    type: AssetTagsAssetIdTagIdUniqueInputDto,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetTagsAssetIdTagIdUniqueInputDto)
  assetId_tagId?: AssetTagsAssetIdTagIdUniqueInputDto;
}
