import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UstadzEventUstadzIdEventIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  ustadzId: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  eventId: string;
}

@ApiExtraModels(UstadzEventUstadzIdEventIdUniqueInputDto)
export class ConnectUstadzEventDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string;
  @ApiProperty({
    type: UstadzEventUstadzIdEventIdUniqueInputDto,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UstadzEventUstadzIdEventIdUniqueInputDto)
  ustadzId_eventId?: UstadzEventUstadzIdEventIdUniqueInputDto;
}
