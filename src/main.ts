import { DatabaseService } from '@core/database/database.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app/app.module';
import { AuthExceptionsFilter } from './common/filters/auth-exception.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import SwaggerDocumentation from './core/config/swagger.config';

declare const module;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const logger = new Logger('HTTP');
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = app.get(ConfigService);
  if (config.get('app.corsEnabled')) {
    app.enableCors({
      origin: 'http://localhost:43000',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    });
  }

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Jika ingin diblock data selain data di dto harus dirubah whitelist = true
      transform: true, // Jika true, maka DataIn akan di transform sesuai dengan deklarinnya, tidak perlu menggunakan ParseXXXPipe
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter)
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const prismaService = app.get(DatabaseService);
  await prismaService.enableShutdownHooks(app);
  
  if (config.get('app.swaggerEnabled')) {
    const swaggerDoc = new SwaggerDocumentation(app);
    swaggerDoc.serve();
  }
  const port = process.env.PORT || 6001;
  await app.listen(port);
  logger.log('server run on ' + port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
