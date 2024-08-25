import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DariAppsheetService } from './dari-appsheet.service';
import { CreateDariAppsheetDto } from './dto/create-dari-appsheet.dto';
import { UpdateDariAppsheetDto } from './dto/update-dari-appsheet.dto';

@Controller('dari-appsheet')
export class DariAppsheetController {
  constructor(private readonly dariAppsheetService: DariAppsheetService) {}

  @Get('transactions')
  findAllTransactions() {
    return this.dariAppsheetService.findAllTransactions();
  }

  @Get('categories')
  findAllCategories() {
    return this.dariAppsheetService.findAllCategories();
  }

  @Get('transactions/:id')
  findOneTransaction(@Param('id') id: string) {
    return this.dariAppsheetService.findOneTransaction(id);
  }

  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.dariAppsheetService.findOneCategory(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDariAppsheetDto: UpdateDariAppsheetDto) {
  //   return this.dariAppsheetService.update(id, updateDariAppsheetDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dariAppsheetService.remove(id);
  }
}
