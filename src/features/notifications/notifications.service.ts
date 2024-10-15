import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Notification } from './entities/index';

@Injectable()
export class NotificationsService {
  constructor(private db: DatabaseService) {}
  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    return await this.db.notification.create({ data });
  }

  async getNotifications(): Promise<Notification[]> {
    return this.db.notification.findMany();
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return this.db.notification.findUnique({ where: { id } });
  }

  async updateNotification(id: string, data: UpdateNotificationDto): Promise<Notification> {
    return this.db.notification.update({ where: { id }, data });
  }

  async deleteNotification(id: string): Promise<Notification> {
    return this.db.notification.delete({ where: { id } });
  }
}
