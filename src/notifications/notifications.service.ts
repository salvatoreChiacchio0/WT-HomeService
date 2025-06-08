import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification> {
    const newNotification = await this.notificationsRepository.create(notification);
    const savedNotification = await this.notificationsRepository.save(newNotification);
    
    // Send real-time notification
    if(notification.userId)
    await this.notificationsGateway.sendNotification(
      notification.userId,
      savedNotification,
    );
    
    return savedNotification;
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.notificationsRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new Error('Notification not found');
    }
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationsRepository.delete({ userId });
  }
} 