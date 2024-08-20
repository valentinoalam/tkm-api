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
  userId: string;
  @ApiProperty({
    type: 'string',
  })
  notification_id: string;
  @ApiProperty({
    enum: NotificationStatus,
  })
  status: NotificationStatus;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: () => Notification,
    required: false,
  })
  notif?: Notification;
}
