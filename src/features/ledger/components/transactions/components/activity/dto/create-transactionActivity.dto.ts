import { Category } from './../../category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionActivityDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
  @IsNotEmpty()
  @IsString()
  debitAccountId: string;
  @IsNotEmpty()
  @IsString()
  creditAccountId: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
