import { ApiProperty } from '@nestjs/swagger';
import { UserNotification } from './userNotification.entity';

export class Notification {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  sender: string | null;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  message: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  photoUrl: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtCreated: Date;
  @ApiProperty({
    type: () => UserNotification,
    isArray: true,
    required: false,
  })
  receiver?: UserNotification[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  sentAt: Date;
}
