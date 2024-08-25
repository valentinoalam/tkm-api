import { PartialType } from '@nestjs/swagger';
import { CreateDariAppsheetDto } from './create-dari-appsheet.dto';

export class UpdateDariAppsheetDto extends PartialType(CreateDariAppsheetDto) {}
