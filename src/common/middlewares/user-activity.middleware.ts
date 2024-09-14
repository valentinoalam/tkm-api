import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@/features/users/services/users.service';
import { User } from '@/features/users/entities';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Ensure that you cast it correctly
    if (user && user.id) {
      // User ID is now available
      console.log('User ID:', user.id);
      await this.usersService.updateLastActive(user.id);
    }
    next();
  }
}
