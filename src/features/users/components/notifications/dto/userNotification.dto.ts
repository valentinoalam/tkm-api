import { NotificationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
