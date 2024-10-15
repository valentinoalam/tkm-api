import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Role } from '@/features/role/entities/role.entity';

export class UserRoles {
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
  roleId: string;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: () => Role,
    required: false,
  })
  role?: Role;
}
