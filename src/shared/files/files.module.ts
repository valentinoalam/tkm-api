import { Global, Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { multerOptions } from '../../core/config/multer.config';

@Global()
@Module({
  imports: [MulterModule.register(multerOptions)],
  controllers: [FilesController],
  providers: [ConfigService, FilesService],
})
export class FilesModule {}
