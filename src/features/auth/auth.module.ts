import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AtStrategy, RtStrategy } from './strategies/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local/local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret:  process.env.WBMS_JWT_AT_KEY,
      signOptions: { expiresIn: '5h' },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('WBMS_JWT_RT_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, RtStrategy, AtStrategy, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
