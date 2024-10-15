import { NotificationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/features/users/entities';
import { Notification } from './notification.entity';

export class UserNotification {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string | null;
  @ApiProperty({
    type: 'string',
  })
  notificationId: string;
  @ApiProperty({
    enum: NotificationStatus,
  })
  status: NotificationStatus;
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
  readAt: Date | null;
  // @ApiProperty({
  //   type: () => User,
  //   required: false,
  //   nullable: true,
  // })
  // user?: User | null;
  // @ApiProperty({
  //   type: () => Notification,
  //   required: false,
  // })
  // notif?: Notification;
}
