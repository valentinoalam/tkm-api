import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/entities/role.entity';

export class RoleAccess {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  roleId: string;
  @ApiProperty({
    type: 'string',
  })
  resource: string;
  @ApiProperty({
    type: 'string',
  })
  action: string;
  @ApiProperty({
    type: () => Role,
    required: false,
  })
  role?: Role;
}
