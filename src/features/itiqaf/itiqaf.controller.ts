import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItiqafService } from './itiqaf.service';
import { CreateItiqafDto } from './dto/create-itiqaf.dto';
import { UpdateItiqafDto } from './dto/update-itiqaf.dto';

@Controller('itiqaf')
export class ItiqafController {
  constructor(private readonly itiqafService: ItiqafService) {}

  @Get()
  async getAllPeserta() {
    return await this.itiqafService.getAllPesertaItiqaf();
  }

  @Post()
  async addPeserta(@Body() data: any) {
    return await this.itiqafService.addPesertaItiqaf(data);
  }

  @Patch('absensi/:nama')
  async absensiPeserta(@Param('nama') nama: string, @Body('check') check: boolean) {
    return await this.itiqafService.absensiHarianPeserta(nama, check);
  }
  
  @Post()
  create(@Body() createItiqafDto: CreateItiqafDto) {
    return this.itiqafService.create(createItiqafDto);
  }

  @Get()
  findAll() {
    return this.itiqafService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itiqafService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItiqafDto: UpdateItiqafDto) {
    return this.itiqafService.update(+id, updateItiqafDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itiqafService.remove(+id);
  }
}
