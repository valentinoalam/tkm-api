import { ApiProperty } from '@nestjs/swagger';

export class RoleAccessDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  resource: string;
  @ApiProperty({
    type: 'string',
  })
  action: string;
}
