import { ApiProperty } from '@nestjs/swagger';
import { UstadzEvent } from '../events/entities';

export class Ustadz {
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
  phone: string;
  @ApiProperty({
    type: 'string',
  })
  address: string;
  @ApiProperty({
    type: () => UstadzEvent,
    isArray: true,
    required: false,
  })
  attendAs?: UstadzEvent[];
}
