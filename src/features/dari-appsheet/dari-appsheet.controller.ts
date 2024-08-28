import { Controller, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DariAppsheetService } from './dari-appsheet.service';

@Controller('dari-appsheet')
export class DariAppsheetController {
  constructor(private readonly dariAppsheetService: DariAppsheetService) {}

  @Get('transactions')
  findAllTransactions( 
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string
  ) {
    return this.dariAppsheetService.findAllTransactions(dateStart, dateEnd);
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
