import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '@core/database/database.service';
import cookieParser from 'cookie-parser';
import SwaggerDocumentation from './core/config/swagger.config';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthExceptionsFilter } from './common/filters/auth-exception.filter';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = app.get(ConfigService);
  if (config.get('app.corsEnabled')) {
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    });
  }
  
  if (config.get('app.swaggerEnabled')) {
    const swaggerDoc = new SwaggerDocumentation(app);
    swaggerDoc.serve();
  }

  // app.setGlobalPrefix('api');
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
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter), new AuthExceptionsFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const prismaService = app.get(DatabaseService);
  await prismaService.enableShutdownHooks(app);

  const port = process.env.PORT || 6001
  await app.listen(port);
  console.log("server run on " + port)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
