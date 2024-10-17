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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '@/features/auth/auth.module';
import { UsersModule } from '@/features/users/users.module';
import { UsersService } from '@/features/users/services/users.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserActivityInterceptor } from '@/common/interceptors/user-activity.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { CaslModule } from './casl/casl.module';
@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
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
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'images'),
      serveRoot: '/img/',
    }),
    AuthModule,
    UsersModule,
    FeaturesModule,
    CaslModule,
  ],

  controllers: [AppController /*SseController*/],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserActivityInterceptor,
    },
    // SseService,
    // BroadcastService,
    /*ConfigValidator*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggedMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
