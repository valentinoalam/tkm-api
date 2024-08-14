import { ApiProperty } from '@nestjs/swagger';
// import { JournalEntry } from '@/features/journal/components/entry/entities';

export class Vendor {
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
  phone: string;
  @ApiProperty({
    type: 'string',
  })
  address: string;
  @ApiProperty({
    type: 'string',
  })
  businessField: string;
  @ApiProperty({
    type: 'string',
  })
  note: string;
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
  // @ApiProperty({
  //   type: () => JournalEntry,
  //   isArray: true,
  //   required: false,
  // })
  // JournalEntry?: JournalEntry[];
}
