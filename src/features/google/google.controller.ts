import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { GoogleService } from './google.service';

import { DataResponse } from '@/common/response/data-response.interface';
import { ResponseSuccess, ResponseError } from '@/common/response/response';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('foto-nota')
  async getFotoNotaData() {
    const gallery = await this.googleService.getUpdateFotoNota();
    return gallery;
  }

  @Get('kas-kecil')
  async getKasKecilData(@Res() res) {
    const dataOut: DataResponse<any>[] = [];
    try {
      const data = await this.googleService.getKasKecilData();
      data.forEach((item) => {
        // Create a DataItemResponse for each item
        dataOut.push({
          records: item,
          totalRecords: item.length,
          page: 0, // or calculate based on your pagination logic
        });
      });
      return res
        .status(HttpStatus.OK)
        .json(new ResponseSuccess('Items retrieved successfully', dataOut));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(new ResponseError('Failed to retrieve items', error));
    }
  }

  @Get('image/:fileId')
  async getImage(@Param('fileId') fileId: string, @Res() res: Response) {
    try {
      //await this.googleService.authenticate();
      const drive = await this.googleService.getDriveApi();
      const fileStream = await this.googleService.getPhotoDetail(drive, fileId);
      res.setHeader('Content-Type', 'image/jpeg');
      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
