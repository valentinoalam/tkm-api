import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { PositionModule } from './components/position/position.module';
import { ProfileModule } from './components/profile/profile.module';
import { NotificationsModule } from './components/notifications/notifications.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PositionModule, ProfileModule, NotificationsModule],
})
export class UsersModule {}
