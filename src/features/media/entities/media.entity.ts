import { ApiProperty } from '@nestjs/swagger';
import { Image } from '@/generated/nestjs-dto/image/entities';

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
}
