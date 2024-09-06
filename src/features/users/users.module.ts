import { Module } from '@nestjs/common';

import { NotificationsModule } from './components/notifications/notifications.module';
import { PositionModule } from './components/position/position.module';
import { ProfileModule } from './components/profile/profile.module';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PositionModule, ProfileModule, NotificationsModule],
})
export class UsersModule {}
