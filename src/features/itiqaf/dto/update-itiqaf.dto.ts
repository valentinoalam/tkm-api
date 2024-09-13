import { PartialType } from '@nestjs/swagger';
import { CreateItiqafDto } from './create-itiqaf.dto';

export class UpdateItiqafDto extends PartialType(CreateItiqafDto) {}
