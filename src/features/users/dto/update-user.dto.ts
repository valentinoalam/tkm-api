import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserNotification } from '@/features/notifications/entities';
import { UserRoles } from '../entities/userRoles.entity';
export class UpdateTransactionDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  hashedPassword?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  hashedRT?: string | null;
  positionId: any;
  @ApiProperty({
    type: () => [UserRoles],
    required: false,
    description: 'The roles assigned to the user',
    isArray: true,
  })
  userRoles?: UserRoles[];
  @ApiProperty({
    type: () => [UserNotification],
    required: false,
    description: 'Notifications received by the user',
    isArray: true,
  })
  notifications?: UserNotification[];
}
