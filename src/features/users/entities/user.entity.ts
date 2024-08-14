import { ApiProperty } from '@nestjs/swagger';
import { Profile } from './profile.entity';

export class User {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  email: string | null;
  @ApiProperty({
    type: 'string',
  })
  username: string;
  @ApiProperty({
    type: 'string',
  })
  hashedPassword: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  hashedRT: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  isConfirmed: boolean;
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
    type: () => Profile,
    required: false,
    nullable: true,
  })
  profile?: Profile | null;
}
