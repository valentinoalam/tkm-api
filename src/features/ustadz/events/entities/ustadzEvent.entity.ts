import { ApiProperty } from '@nestjs/swagger';
import { Ustadz } from '../../entities';
import { Event } from './event.entity';

export class UstadzEvent {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  ustadzId: string;
  @ApiProperty({
    type: 'string',
  })
  eventId: string;
  @ApiProperty({
    type: () => Ustadz,
    required: false,
  })
  Ustadz?: Ustadz;
  @ApiProperty({
    type: () => Event,
    required: false,
  })
  Event?: Event;
}
