import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiOkResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { DariAppsheetService } from './dari-appsheet.service';
import {
  CreateAppsheetKategoriDto,
  CreateAppsheetTransaksiDto,
} from './dto/create-dari-appsheet.dto';
import {
  UpdateAppsheetTransaksiDto,
  UpdateAppsheetKategoriDto,
  UpdateAppsheetPhotoDto,
} from './dto/update-dari-appsheet.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerOptions } from '@/core/config/multer.config';

@Controller('dari-appsheet')
export class DariAppsheetController {
  constructor(private readonly dariAppsheetService: DariAppsheetService) {}

  @Get('data-chart')
  getTransactionsDataChart() {
    return this.dariAppsheetService.getTransactionsDataChart();
  }

  @Get('data-summary')
  getTransactionsDataChartCompact() {
    return this.dariAppsheetService.getChartDataReport();
  }

  @Get('transactions')
  findAllTransactions(
    @Query('startDate') dateStart?: string,
    @Query('endDate') dateEnd?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.dariAppsheetService.findAllTransactions(
      dateStart,
      dateEnd,
      page,
      limit,
      search
    );
  }

  @Get('categories')
  findAllCategories() {
    return this.dariAppsheetService.findAllCategories();
  }

  @Get('gallery')
  showAllNotaImage() {
    return this.dariAppsheetService.showAllNotaImage();
  }

  @Get('balance')
  getMonthlyReport(    
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.dariAppsheetService.getMonthlyBalanceReport(month, year);
  }
  @Get('transactions/:id')
  findOneTransaction(@Param('id') id: string) {
    return this.dariAppsheetService.findOneTransaction(id);
  }

  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.dariAppsheetService.findOneCategory(id);
  }

  @Post('transaksi')
  @ApiOperation({
    summary: 'Create a transaction',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Transaction has been successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiForbiddenResponse({
    description: 'transaction already exists',
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(HttpStatus.CREATED)
  async createTransaksi(
    @Body() data: CreateAppsheetTransaksiDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.dariAppsheetService.createTransaksi(data, file);
  }

  @Post('kategori')
  async createKategori(@Body() data: CreateAppsheetKategoriDto) {
    return await this.dariAppsheetService.createKategori(data);
  }

  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads', // Folder where images will be stored
      filename: (req, file, cb) => {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname); // Extract file extension
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  @Post('photo')
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    console.log('File received:', file);
    return {
      message: 'File uploaded successfully',
      filePath: `/uploads/${file.filename}`,
    };
  }

  @Patch('transaksi/:id')
  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'User has been successfully updated' })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateTransaksi(
    @Param('id') id: string,
    @Body() data: UpdateAppsheetTransaksiDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.dariAppsheetService.updateTransaksi(id, data, file);
  }

  @Patch('kategori/:id')
  async updateKategori(
    @Param('id') id: string,
    @Body() data: UpdateAppsheetKategoriDto,
  ) {
    return await this.dariAppsheetService.updateKategori(id, data);
  }

  @Patch('photo/:id')
  async updatePhotoData(
    @Param('id') id: string,
    @Body() data: UpdateAppsheetPhotoDto,
  ) {
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
