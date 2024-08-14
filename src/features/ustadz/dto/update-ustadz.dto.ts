import { PartialType } from '@nestjs/swagger';
import { CreateUstadzDto } from './create-ustadz.dto';

export class UpdateUstadzDto extends PartialType(CreateUstadzDto) {}
