import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../components/position/entities';
import { Profile } from '../components/profile/entities';
import { Mosque } from '@/features/mosque/entities';
import { UserNotification } from '@/features/notifications/entities';
import { UserRoles } from './userRoles.entity';

export class User {
  @ApiProperty({
    type: 'string',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'The user\'s email address',
  })
  email: string | null;

  @ApiProperty({
    type: 'string',
    description: 'The user\'s username',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'The hashed password of the user',
  })
  hashedPassword: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'The hashed refresh token',
  })
  hashedRT: string | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
    description: 'The last active timestamp of the user',
  })
  lastActive: Date | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The timestamp when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
    description: 'The timestamp when the user was last updated',
  })
  updatedAt: Date | null;

  @ApiProperty({
    type: () => Profile,
    required: false,
    nullable: true,
    description: 'The profile associated with the user',
  })
  profile?: Profile | null;

  @ApiProperty({
    type: () => Position,
    required: false,
    nullable: true,
    description: 'The position associated with the user',
  })
  position?: Position | null;

  @ApiProperty({
    type: () => [UserRoles],
    required: false,
    description: 'The roles assigned to the user',
  })
  userRoles?: UserRoles[];

  @ApiProperty({
    type: () => Mosque,
    required: false,
    nullable: true,
    description: 'The mosque associated with the user',
  })
  mosque?: Mosque | null;  // Fixed naming to lowercase 'mosque' for consistency

  @ApiProperty({
    type: () => [UserNotification],
    required: false,
    description: 'Notifications received by the user',
    isArray: true,
  })
  notifications?: UserNotification[];
}
