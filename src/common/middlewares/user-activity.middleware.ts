import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@/features/users/services/users.service';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id; // Assuming you have user ID in request
    console.log('Request logged:', req.method, req.originalUrl);
    console.log(req.user)
    if (userId) {
      await this.usersService.updateLastActive(userId);
    }
    next();
  }
}
