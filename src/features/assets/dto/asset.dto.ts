import { AssetTypes, AcquisitionOrigin } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AssetDto {
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
    type: 'string',
    format: 'date-time',
  })
  date_acquired: Date;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  economicLife: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  qty: number;
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
    type: 'string',
  })
  createdBy: string;
  @ApiProperty({
    type: 'string',
  })
  editedBy: string;
  @ApiProperty({
    enum: AssetTypes,
  })
  type: AssetTypes;
  @ApiProperty({
    enum: AcquisitionOrigin,
  })
  origin: AcquisitionOrigin;
}
