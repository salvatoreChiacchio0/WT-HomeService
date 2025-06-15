import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createNotificationDto: Partial<Notification>): Promise<Notification> {
    console.log(createNotificationDto)
    const notification = this.notificationsRepository.create(createNotificationDto);
    const savedNotification = await this.notificationsRepository.save(notification);
    await this.notificationsGateway.sendNotificationToReceiver(savedNotification);
    return savedNotification;
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId, isRead: false },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationsRepository.findOne({
      where: { id },
      relations: ['sender'],
    });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const notification = await this.findOne(id);
    if (notification) {
      notification.isRead = true;
      const updatedNotification = await this.notificationsRepository.save(notification);
      await this.notificationsGateway.emitNotificationUpdate(updatedNotification);
      return updatedNotification;
    }
    return null;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.findAll(userId);
    for (const notification of notifications) {
      if (!notification.isRead) {
        notification.isRead = true;
        const updatedNotification = await this.notificationsRepository.save(notification);
        await this.notificationsGateway.emitNotificationUpdate(updatedNotification);
      }
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id);
    if (notification && notification.userId === userId) {
      await this.notificationsRepository.remove(notification);
      await this.notificationsGateway.emitNotificationDelete(id, userId);
    }
  }

  async removeAll(userId: string): Promise<void> {
    const notifications = await this.findAll(userId);
    for (const notification of notifications) {
      await this.notificationsRepository.remove(notification);
      await this.notificationsGateway.emitNotificationDelete(notification.id, userId);
    }
  }
} 