import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UserNotificationUserIdNotificationIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  notification_id: string;
}

@ApiExtraModels(UserNotificationUserIdNotificationIdUniqueInputDto)
export class ConnectUserNotificationDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string;
  @ApiProperty({
    type: UserNotificationUserIdNotificationIdUniqueInputDto,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserNotificationUserIdNotificationIdUniqueInputDto)
  userId_notification_id?: UserNotificationUserIdNotificationIdUniqueInputDto;
}
