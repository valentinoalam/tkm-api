import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Response } from 'express';
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('foto-nota')
  async getFotoNotaData() {
    const drive = await this.googleService.getDriveApi(); // Assume this method returns the Drive API client
    const gallery = await this.googleService.getFotoNotaData(drive);

    return gallery;
    
  }

  @Get('kas-kecil')
  async getKasKecilData() {
    const jurnal = await this.googleService.getKasKecilData();

    return jurnal;
  }
  @Get('kategori-entry')
  async syncKasKecilKategori() {
    const categories = await this.googleService.syncKasKecilKategori();

    return categories;
    
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
      throw new HttpException('Failed to fetch file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
