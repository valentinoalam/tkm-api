import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/features/users/entities';
import { Organization } from '@/features/mosque/organization/entities';

export class Position {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  organizationId: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
  @ApiProperty({
    type: () => User,
    isArray: true,
    required: false,
  })
  user?: User[];
  @ApiProperty({
    type: () => Organization,
    required: false,
  })
  Organization?: Organization;
}
