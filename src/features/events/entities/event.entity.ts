import { Period } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Participant } from '../components/participants/entities';
import { Position } from '@/features/users/components/position/entities';
import { UstadzEvent } from '@/features/ustadz/events/entities';

export class Event {
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
  place: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtStart: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtEnd: Date;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  quota: number;
  @ApiProperty({
    type: 'string',
  })
  description: string;
  @ApiProperty({
    enum: Period,
    nullable: true,
  })
  heldPeriod: Period | null;
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
    type: 'string',
  })
  createdBy: string;
  @ApiProperty({
    type: () => Participant,
    isArray: true,
    required: false,
  })
  participant?: Participant[];
  @ApiProperty({
    type: () => Position,
    isArray: true,
    required: false,
  })
  team?: Position[];
  @ApiProperty({
    type: () => UstadzEvent,
    isArray: true,
    required: false,
  })
  speakers?: UstadzEvent[];
}
