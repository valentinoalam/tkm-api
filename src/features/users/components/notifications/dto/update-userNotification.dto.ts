import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UpdateUserNotificationDto {
  @ApiProperty({
    enum: NotificationStatus,
    required: false,
  })
  @IsOptional()
  status?: NotificationStatus;
}
