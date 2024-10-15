import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AppsheetKategori } from '@/features/dari-appsheet/entities';
import { TransactionCategory } from '@/features/ledger/components/transactions/entities';

export class Budget {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  categoryId: string | null;
  // @ApiProperty({
  //   type: 'string',
  // })
  // trxCategoryId: string | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  amount: Prisma.Decimal;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  year: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  month: number;
  @ApiProperty({
    type: () => AppsheetKategori,
    required: false,
    nullable: true,
  })
  category?: AppsheetKategori | null;
  // @ApiProperty({
  //   type: () => TransactionCategory,
  //   required: false,
  //   nullable: true,
  // })
  // trxCategory?: TransactionCategory | null;
}
