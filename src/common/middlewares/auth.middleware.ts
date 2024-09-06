import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: Request & { userId: number }, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} — ${userAgent} ${ip}`,
      );

      if (method !== 'GET') {
        this.logger.debug(
          `Request body — ${JSON.stringify(req.body, null, 2)}`,
        );
      }
    });
    console.log('Request...');
    // Assuming you have middleware to authenticate and extract the user ID
    const userId = req.user['id']; // Replace with the actual user ID retrieval logic
    req.userId = userId;
    if (!req.headers['authorization']) {
      throw new UnauthorizedException();
    }
    next();
  }
}
