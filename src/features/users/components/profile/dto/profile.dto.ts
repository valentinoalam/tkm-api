import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
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
    nullable: true,
  })
  profilePic: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  phone: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  address: string | null;
  @ApiProperty({
    type: 'string',
  })
  position: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  userCreated: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  userModified: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtCreated: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  dtModified: Date | null;
}
