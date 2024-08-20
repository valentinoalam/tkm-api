import { Boundary } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionActivity } from '../../activity/entities';

export class TransactionCategory {
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
    enum: Boundary,
  })
  boundary: Boundary;
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
    type: () => TransactionActivity,
    isArray: true,
    required: false,
  })
  activity?: TransactionActivity[];
}
