import { ApiProperty } from '@nestjs/swagger';

export class UserRolesDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
