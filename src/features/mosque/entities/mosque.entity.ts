import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../organization/entities';

export class Mosque {
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
  address: string;
  @ApiProperty({
    type: 'string',
  })
  city: string;
  @ApiProperty({
    type: 'string',
  })
  province: string;
  @ApiProperty({
    type: 'string',
  })
  logoUrl: string;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
  })
  whatsappNo: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  phoneNo: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  websiteUrl: string | null;
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
    type: () => Organization,
    required: false,
    nullable: true,
  })
  organization?: Organization | null;
}
