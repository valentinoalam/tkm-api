import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

// import { UserNotification } from '../components/notifications/entities';
// import { Position } from '../components/position/entities';
// import { Profile } from '../components/profile/entities';

// import { Participant } from '@/features/events/components/participants/entities';

export class User {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  email: string | null;
  @ApiProperty({
    type: 'string',
  })
  username: string;
  @ApiProperty({
    type: 'string',
  })
  hashedPassword: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  hashedRT: string | null;
  @ApiProperty({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    format: 'date-time',
    nullable: true,
  })
  lastActive: Date;
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
    enum: Role,
  })
  role: Role;

  // @ApiProperty({
  //   type: () => UserNotification,
  //   isArray: true,
  //   required: false,
  // })
  // userNotification?: UserNotification[];
  // @ApiProperty({
  //   type: () => Participant,
  //   isArray: true,
  //   required: false,
  // })
  // participant?: Participant[];
}
