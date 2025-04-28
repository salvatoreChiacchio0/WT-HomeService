import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/chat/chat.entity';
import { ChatService } from './chat.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports:[TypeOrmModule.forFeature([Message]),RedisModule],
  controllers: [ChatController],
  providers:[ChatGateway,ChatService]
})
export class ChatModule {}
