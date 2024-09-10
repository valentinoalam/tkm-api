import { ApiProperty } from '@nestjs/swagger';

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
    type: 'boolean',
  })
  isConfirmed: boolean;
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
  // @ApiProperty({
  //   type: () => Profile,
  //   required: false,
  //   nullable: true,
  // })
  // profile?: Profile | null;
  // @ApiProperty({
  //   type: () => UserNotification,
  //   isArray: true,
  //   required: false,
  // })
  // userNotification?: UserNotification[];
  // @ApiProperty({
  //   type: () => Position,
  //   isArray: true,
  //   required: false,
  // })
  // position?: Position[];
  // @ApiProperty({
  //   type: () => Participant,
  //   isArray: true,
  //   required: false,
  // })
  // participant?: Participant[];
}
