import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@/features/users/components/position/entities';
import { Mosque } from '../../entities';

export class Organization {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  mosqueId: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  periode: string;
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
    type: () => Position,
    isArray: true,
    required: false,
  })
  member?: Position[];
  @ApiProperty({
    type: () => Mosque,
    required: false,
  })
  mosque?: Mosque;
}
