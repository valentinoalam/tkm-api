import {ApiProperty} from '@nestjs/swagger'

export class UpdateConfigDto {
  name?: string;
  description?: string;
  lvlOfApprvl?: number;
  defaultVal?: string;
  tempValue?: string;
  dtModified?: string;
  userModified?: string;
  
}
