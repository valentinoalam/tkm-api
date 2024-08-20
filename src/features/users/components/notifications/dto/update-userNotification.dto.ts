import { NotificationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserNotificationDto {
  @ApiProperty({
    enum: NotificationStatus,
    required: false,
  })
  @IsOptional()
  status?: NotificationStatus;
}
