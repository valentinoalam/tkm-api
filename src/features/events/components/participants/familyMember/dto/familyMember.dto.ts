import { ApiProperty } from '@nestjs/swagger';

export class FamilyMemberDto {
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
  information: string;
  @ApiProperty({
    type: 'string',
  })
  relationType: string;
}
