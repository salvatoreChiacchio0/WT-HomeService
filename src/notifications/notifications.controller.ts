import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req): Promise<Notification[]> {
    return this.notificationsService.findAll(req.user.sub);
  }

  @Get('unread')
  async findUnread(@Request() req): Promise<Notification[]> {
    return this.notificationsService.findUnread(req.user.sub);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req): Promise<Notification> {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }

  @Post('read-all')
  async markAllAsRead(@Request() req): Promise<void> {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    return this.notificationsService.delete(id, req.user.sub);
  }

  @Delete()
  async deleteAll(@Request() req): Promise<void> {
    return this.notificationsService.deleteAll(req.user.sub);
  }
} 