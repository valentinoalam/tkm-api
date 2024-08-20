import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  sender: string | null;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  message: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  photoUrl: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  dtCreated: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  sentAt: Date;
}
