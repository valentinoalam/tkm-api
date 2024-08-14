import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

export class UploadFileDto {
  // @ArrayNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

}
