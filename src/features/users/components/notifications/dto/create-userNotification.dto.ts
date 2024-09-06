import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateUserNotificationDto {
  @ApiProperty({
    enum: NotificationStatus,
  })
  @IsNotEmpty()
  status: NotificationStatus;
}
