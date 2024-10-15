import { PartialType } from '@nestjs/swagger';
import { CreateAccountsDto } from './create-account.dto';

export class UpdateAccountsDto extends PartialType(CreateAccountsDto) {}
