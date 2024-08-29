import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../core/database/database.module';
import { join } from 'path';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@core/config/configuration';
import { ConfigValidator } from '@/core/config/validator/config.validator';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggedMiddleware } from '@common/middlewares/logged.middleware';
import { FeaturesModule } from '@/features/features.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: ConfigValidator,
      isGlobal: true,
    }),
    HealthModule,
    DatabaseModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    //   // other options
    }),
    // ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'images'),
      serveRoot: '/img/',
    }),
    //   inject: [AppConfigService],
    //   imports: [AppConfigModule],
    // }),
    FeaturesModule
  ],

  controllers: [AppController, /*SseController*/],
  providers: [
    AppService, 
    // SseService,
    // BroadcastService,
    LoggedMiddleware
    /*ConfigValidator*/
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggedMiddleware).forRoutes('*');
  }
}