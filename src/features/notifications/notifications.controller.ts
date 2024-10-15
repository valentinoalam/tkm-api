import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(@Body() dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.createNotification(dto);
  }

  @Get()
  async getNotifications(): Promise<Notification[]> {
    return this.notificationsService.getNotifications();
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationsService.getNotificationById(id);
  }

  @Patch(':id')
  async updateNotification(@Param('id') id: string, @Body() dto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationsService.updateNotification(id, dto);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.deleteNotification(id);
  }
}
