import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/chat/chat.entity';
import { ChatService } from './chat.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    NotificationsModule,
    UsersModule,
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: ChatGateway,
      useClass: ChatGateway,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
