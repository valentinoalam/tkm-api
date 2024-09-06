import { ApiProperty } from '@nestjs/swagger';

import { EmergencyContact } from '../emergencyContact/entities';
import { FamilyMember } from '../familyMember/entities';

import { Event } from '@/features/events/entities';
import { Profile } from '@/features/users/components/profile/entities';
import { User } from '@/features/users/entities';

export class Participant {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: 'string',
  })
  eventId: string;
  @ApiProperty({
    type: 'string',
  })
  profileId: string;
  @ApiProperty({
    type: 'string',
  })
  emergencyId: string;
  @ApiProperty({
    type: 'boolean',
  })
  withFamily: boolean;
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
    type: () => Profile,
    required: false,
  })
  profile?: Profile;
  @ApiProperty({
    type: () => EmergencyContact,
    required: false,
  })
  emergencyContact?: EmergencyContact;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: () => Event,
    required: false,
  })
  event?: Event;
  @ApiProperty({
    type: () => FamilyMember,
    isArray: true,
    required: false,
  })
  member?: FamilyMember[];
}
