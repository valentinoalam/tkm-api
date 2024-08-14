import { ApiProperty } from '@nestjs/swagger';

export class MediaDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
