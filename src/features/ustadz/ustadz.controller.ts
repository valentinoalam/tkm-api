import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UstadzService } from './ustadz.service';
import { CreateUstadzDto } from './dto/create-ustadz.dto';
import { UpdateUstadzDto } from './dto/update-ustadz.dto';

@Controller('ustadz')
export class UstadzController {
  constructor(private readonly ustadzService: UstadzService) {}

  @Post()
  create(@Body() createUstadzDto: CreateUstadzDto) {
    return this.ustadzService.create(createUstadzDto);
  }

  @Get()
  findAll() {
    return this.ustadzService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ustadzService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUstadzDto: UpdateUstadzDto) {
    return this.ustadzService.update(+id, updateUstadzDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ustadzService.remove(+id);
  }
}
