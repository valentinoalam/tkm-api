import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../core/database/database.module';
import { join } from 'path';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@core/config/configuration';
import { ConfigValidator } from '@/core/config/validator/config.validator';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BroadcastService } from '@feat/sse/broadcast.service';
import { SseService } from '@feat/sse/sse.service';

import { SseController } from '@feat/sse/sse.controller';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggedMiddleware } from '@common/middlewares/logged.middleware';
import { FeaturesModule } from '@/features/features.module';

// import { appConfigValidationSchema } from '@core/config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      // validationSchema: appConfigValidationSchema,
      validate: ConfigValidator,
      isGlobal: true,
      // envFilePath: path.resolve(__dirname, '../../.env'), // if you want to specify the path to env file
    }),
    HealthModule,
    DatabaseModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        // other transports...
      ],
    //   // other options
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/img/',
    }),
    // GraphQLModule.forRootAsync({
    //   useFactory: async (appConfig: AppConfigService) => ({
    //     installSubscriptionHandlers: true,
    //     buildSchemaOptions: {
    //       numberScalarMode: 'integer',
    //     },
    //     sortSchema: appConfig.graphqlSortSchema,
    //     autoSchemaFile: appConfig.graphqlSchemaDestination,
    //     debug: appConfig.graphqlDebug,
    //     playground: appConfig.graphqlPlaygroundEnabled,
    //     context: ({ req }) => ({ req }),
    //     formatError: (error: GraphQLError) => {
    //       const exception = error.extensions?.exception?.response;
    //       const logger = new Logger('GraphQLError');
    //       logger.error(JSON.stringify(error));

    //       return {
    //         message: exception?.message || error.message || 'INTERNAL_SERVER_ERROR',
    //         code: exception?.code || error.extensions?.response?.statusCode || 500,
    //         data: exception?.data || {},
    //         info: exception?.code || error.extensions?.response?.message || '',
    //       };
    //     },
    //   }),
    //   inject: [AppConfigService],
    //   imports: [AppConfigModule],
    // }),
    FeaturesModule
  ],

  controllers: [AppController, SseController],
  providers: [
    AppService, 
    SseService,
    BroadcastService,
    LoggedMiddleware
    /*ConfigValidator*/
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggedMiddleware).forRoutes('*');
  }
}