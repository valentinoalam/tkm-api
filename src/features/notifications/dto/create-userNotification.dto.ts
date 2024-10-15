import { NotificationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
  @IsNotEmpty()
  @IsString()
  notificationId: string;
  @ApiProperty({
    enum: NotificationStatus,
    description: 'The status of the notification',
  })
  @IsNotEmpty()
  status: NotificationStatus;

  @ApiProperty({
    type: String, // 'string' as type
    format: 'date-time',
    required: false,
    nullable: true,
    description: 'The date and time when the notification was read',
  })
  @IsOptional()
  @IsDateString() // Will validate if it's a proper ISO date string
  readAt?: Date | null;
}
