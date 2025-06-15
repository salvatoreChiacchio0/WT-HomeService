import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseUUIDPipe, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req): Promise<Notification[]> {
    return this.notificationsService.findAll(req.user.sub.toString());
  }

  @Get('unread')
  findUnread(@Request() req): Promise<Notification[]> {
    return this.notificationsService.findUnread(req.user.sub.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationsService.findOne(id);
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationsService.markAsRead(id);
  }

  @Post('read-all')
  markAllAsRead(@Request() req): Promise<void> {
    return this.notificationsService.markAllAsRead(req.user.sub.toString());
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.notificationsService.remove(id, req.user.sub.toString());
  }

  @Delete()
  removeAll(@Request() req): Promise<void> {
    return this.notificationsService.removeAll(req.user.sub.toString());
  }
} 