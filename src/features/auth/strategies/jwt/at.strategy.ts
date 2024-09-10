import { DatabaseService } from '@core/database/database.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../payloads/jwtPayload.type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    config: ConfigService,
    private db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        AtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwtAccessSecret'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.headers.authorization) return req.headers.authorization;
    return null;
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
