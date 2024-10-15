import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@/core/database/database.service';
import { NotificationStatus, UserNotification } from '@prisma/client';
import { CreateUserNotificationDto } from './dto/create-userNotification.dto';

class UserNotificationsService {
  constructor(private db: DatabaseService) {}

  async createUserNotification(data: CreateUserNotificationDto): Promise<UserNotification> {
    const { notificationId, userId, ...rest } = data;
    return this.db.userNotification.create({ 
        data: {
            ...rest,
            notif: {
                connect:{
                    id: notificationId
                }
            },
            user: {
                connect:{
                    id: userId
                }
            }
        } 
    });
  }

  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    return this.db.userNotification.findMany({ where: { userId } });
  }

  async updateUserNotificationStatus(id: string, status: NotificationStatus): Promise<UserNotification> {
    return this.db.userNotification.update({
      where: { id },
      data: { status, readAt: status === NotificationStatus.Readed ? new Date() : null },
    });
  }
}

describe('UserNotificationsService', () => {
  let service: UserNotificationsService;
  let db: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserNotificationsService,
        {
          provide: DatabaseService,
          useValue: {
            userNotification: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserNotificationsService>(UserNotificationsService);
    db = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUserNotification', () => {
    it('should create a new user notification', async () => {
        const user = await db.user.findFirst({where:{}})
        const notif = await db.notification.findFirst({where:{}})
      const mockUserNotification: UserNotification = {
        id: '1',
        userId: user.id,
        notificationId: notif.id,
        status: NotificationStatus.Pending,
        createdAt: new Date(),
        readAt: null,
      };

      (db.userNotification.create as jest.Mock).mockResolvedValue(mockUserNotification);

      const result = await service.createUserNotification(mockUserNotification);
      expect(result).toEqual(mockUserNotification);
      expect(db.userNotification.create).toHaveBeenCalledWith({ data: mockUserNotification });
    });
  });

  describe('getUserNotifications', () => {
    it('should return an array of user notifications', async () => {
        const user = await db.user.findFirst({where:{}})
        const notif = await db.notification.findFirst({where:{}})
        const notif2 = await db.notification.findFirst({where:{}})
      const mockUserNotifications: UserNotification[] = [
        {
          id: '1',
          userId: user.id,
          notificationId: notif.id,
          status: NotificationStatus.Sent,
          createdAt: new Date(),
          readAt: null,
        },
        {
          id: '2',
          userId: user.id,
          notificationId: notif2.id,
          status: NotificationStatus.Delivered,
          createdAt: new Date(),
          readAt: null,
        },
      ];

      (db.userNotification.findMany as jest.Mock).mockResolvedValue(mockUserNotifications);

      const result = await service.getUserNotifications('user1');
      expect(result).toEqual(mockUserNotifications);
      expect(db.userNotification.findMany).toHaveBeenCalledWith({ where: { userId: user.id } });
    });
  });

  describe('updateUserNotificationStatus', () => {
    it('should update user notification status to Read and set readAt', async () => {
        const user = await db.user.findFirst({where:{}})
        const notif = await db.notification.findFirst({where:{}})
        const mockUserNotification: UserNotification = {
        id: '1',
        userId: user.id,
        notificationId: notif.id,
        status: NotificationStatus.Readed,
        createdAt: new Date(),
        readAt: new Date(),
      };

      (db.userNotification.update as jest.Mock).mockResolvedValue(mockUserNotification);

      const result = await service.updateUserNotificationStatus('1', NotificationStatus.Readed);
      expect(result).toEqual(mockUserNotification);
      expect(db.userNotification.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: NotificationStatus.Readed, readAt: expect.any(Date) },
      });
    });

    it('should update user notification status to non-Read and set readAt to null', async () => {
        const user = await db.user.findFirst({where:{}})
        const notif = await db.notification.findFirst({where:{}})
        const mockUserNotification: UserNotification = {
        id: '1',
        userId: user.id,
        notificationId: notif.id,
        status: NotificationStatus.Delivered,
        createdAt: new Date(),
        readAt: null,
      };

      (db.userNotification.update as jest.Mock).mockResolvedValue(mockUserNotification);

      const result = await service.updateUserNotificationStatus('1', NotificationStatus.Delivered);
      expect(result).toEqual(mockUserNotification);
      expect(db.userNotification.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: NotificationStatus.Delivered, readAt: null },
      });
    });
  });
});