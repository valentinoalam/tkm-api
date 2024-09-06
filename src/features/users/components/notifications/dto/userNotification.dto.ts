import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';

export class UserNotificationDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    enum: NotificationStatus,
  })
  status: NotificationStatus;
}
