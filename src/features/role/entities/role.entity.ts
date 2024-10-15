import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@/features/users/entities/userRoles.entity';
import { RoleAccess } from './roleAccess.entity';

export class Role {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  description: string;
  @ApiProperty({
    type: () => UserRoles,
    isArray: true,
    required: false,
  })
  user_roles?: UserRoles[];
  @ApiProperty({
    type: () => RoleAccess,
    isArray: true,
    required: false,
  })
  roleAccess?: RoleAccess[];
}
