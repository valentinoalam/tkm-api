import { Controller, Get, Body, Patch, Param, Delete, Query, Post, Put, HttpCode, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DariAppsheetService } from './dari-appsheet.service';
import { CreateAppsheetKategoriDto, CreateAppsheetTransaksiDto } from './dto/create-dari-appsheet.dto';
import { UpdateAppsheetTransaksiDto, UpdateAppsheetKategoriDto, UpdateAppsheetPhotoDto } from './dto/update-dari-appsheet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiOkResponse, ApiConsumes, ApiCreatedResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@Controller('dari-appsheet')
export class DariAppsheetController {
  constructor(private readonly dariAppsheetService: DariAppsheetService) {}

  @Get('transactions')
  getTransactionsDataChart() {
    return this.dariAppsheetService.getTransactionsDataChart();
  }

  @Get('transactions')
  findAllTransactions( 
    @Query('startDate') dateStart?: string,
    @Query('endDate') dateEnd?: string,
    @Query('endDate') page?: number, 
    @Query('endDate') limit?: number
  ) {
    return this.dariAppsheetService.findAllTransactions(dateStart, dateEnd, page, limit);
  }

  @Get('categories')
  findAllCategories() {
    return this.dariAppsheetService.findAllCategories();
  }

  @Get('gallery')
  showAllNotaImage() {
    return this.dariAppsheetService.showAllNotaImage();
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

  @ApiOperation({
    summary: 'Create a transaction',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Transaction has been successfully created' })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiForbiddenResponse({
    description: 'transaction already exists',
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post('transaksi')
  async createTransaksi(@Body() data: CreateAppsheetTransaksiDto, @UploadedFile() file: Express.Multer.File) {
    return await this.dariAppsheetService.createTransaksi(data, file);
  }

  @Post('kategori')
  async createKategori(@Body() data: CreateAppsheetKategoriDto) {
    return await this.dariAppsheetService.createKategori(data);
  }

  @Put('transaksi/:id')
  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'User has been successfully updated' })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateTransaksi(@Param('id') id: string, @Body() data: UpdateAppsheetTransaksiDto,  @UploadedFile() file: Express.Multer.File) {
    return await this.dariAppsheetService.updateTransaksi(id, data, file);
  }

  @Put('kategori/:id')
  async updateKategori(@Param('id') id: string, @Body() data: UpdateAppsheetKategoriDto) {
    return await this.dariAppsheetService.updateKategori(id, data);
  }

  @Put('photo/:id')
  async updatePhotoData(@Param('id') id: string, @Body() data: UpdateAppsheetPhotoDto) {
    return await this.dariAppsheetService.updatePhotoData(id, data);
  }

  @Delete('transaksi/:id')
  async batalkanTransaksi(@Param('id') id: string) {
    return await this.dariAppsheetService.batalkanTransaksi(id);
  }

  @Delete('kategori/:id')
  async removeKategori(@Param('id') id: string) {
    return await this.dariAppsheetService.removeKategori(id);
  }
}
