import { Injectable } from '@nestjs/common';
import { CreateUstadzDto } from './dto/create-ustadz.dto';
import { UpdateUstadzDto } from './dto/update-ustadz.dto';

@Injectable()
export class UstadzService {
  create(createUstadzDto: CreateUstadzDto) {
    return 'This action adds a new ustadz';
  }

  findAll() {
    return `This action returns all ustadz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ustadz`;
  }

  update(id: number, updateUstadzDto: UpdateUstadzDto) {
    return `This action updates a #${id} ustadz`;
  }

  remove(id: number) {
    return `This action removes a #${id} ustadz`;
  }
}
