import { join } from 'path';

import { LoggedMiddleware } from '@common/middlewares/logged.middleware';
import configuration from '@core/config/configuration';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { DatabaseModule } from '../core/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

import { ConfigValidator } from '@/core/config/validator/config.validator';
import { FeaturesModule } from '@/features/features.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserActivityMiddleware } from '@/common/middlewares/user-activity/user-activity.middleware';
@Module({
  imports: [
    CacheModule.register(),
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
    FeaturesModule,
  ],

  controllers: [AppController /*SseController*/],
  providers: [
    AppService,
    // SseService,
    // BroadcastService,
    /*ConfigValidator*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggedMiddleware, UserActivityMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }

}
