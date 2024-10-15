import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationStatus } from '@prisma/client';
import { DatabaseService } from '@/core/database/database.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let db: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: DatabaseService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    db = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const mockNotification: Notification = {
        id: '1',
        sender: 'System',
        title: 'Test Notification',
        message: 'This is a test notification',
        photoUrl: null,
        dtCreated: new Date(),
        sentAt: new Date(),
      };

      (db.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.createNotification(mockNotification);
      expect(result).toEqual(mockNotification);
      expect(db.notification.create).toHaveBeenCalledWith({ data: mockNotification });
    });
  });

  describe('getNotifications', () => {
    it('should return an array of notifications', async () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          sender: 'System',
          title: 'Test Notification 1',
          message: 'This is test notification 1',
          photoUrl: null,
          dtCreated: new Date(),
          sentAt: new Date(),
        },
        {
          id: '2',
          sender: 'Admin',
          title: 'Test Notification 2',
          message: 'This is test notification 2',
          photoUrl: null,
          dtCreated: new Date(),
          sentAt: new Date(),
        },
      ];

      (db.notification.findMany as jest.Mock).mockResolvedValue(mockNotifications);

      const result = await service.getNotifications();
      expect(result).toEqual(mockNotifications);
      expect(db.notification.findMany).toHaveBeenCalled();
    });
  });

  describe('getNotificationById', () => {
    it('should return a notification by id', async () => {
      const mockNotification: Notification = {
        id: '1',
        sender: 'System',
        title: 'Test Notification',
        message: 'This is a test notification',
        photoUrl: null,
        dtCreated: new Date(),
        sentAt: new Date(),
      };

      (db.notification.findUnique as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.getNotificationById('1');
      expect(result).toEqual(mockNotification);
      expect(db.notification.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if notification is not found', async () => {
      (db.notification.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.getNotificationById('999');
      expect(result).toBeNull();
      expect(db.notification.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('updateNotification', () => {
    it('should update a notification', async () => {
      const mockNotification: Notification = {
        id: '1',
        sender: 'System',
        title: 'Updated Test Notification',
        message: 'This is an updated test notification',
        photoUrl: null,
        dtCreated: new Date(),
        sentAt: new Date(),
      };

      (db.notification.update as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.updateNotification('1', mockNotification);
      expect(result).toEqual(mockNotification);
      expect(db.notification.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: mockNotification,
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const mockNotification: Notification = {
        id: '1',
        sender: 'System',
        title: 'Test Notification',
        message: 'This is a test notification',
        photoUrl: null,
        dtCreated: new Date(),
        sentAt: new Date(),
      };

      (db.notification.delete as jest.Mock).mockResolvedValue(mockNotification);

      const result = await service.deleteNotification('1');
      expect(result).toEqual(mockNotification);
      expect(db.notification.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});