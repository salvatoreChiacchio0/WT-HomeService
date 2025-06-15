import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule,
    RedisModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: NotificationsGateway,
      useClass: NotificationsGateway,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {} 