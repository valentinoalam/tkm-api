import { ApiProperty } from '@nestjs/swagger';

import { Participant } from '../../entities';

export class FamilyMember {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  participantId: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  information: string;
  @ApiProperty({
    type: 'string',
  })
  relationType: string;
  @ApiProperty({
    type: () => Participant,
    required: false,
  })
  guardian?: Participant;
}
