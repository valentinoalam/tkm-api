import { ApiProperty } from '@nestjs/swagger';

export class UstadzEventDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
