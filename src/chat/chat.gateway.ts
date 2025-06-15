import { Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Message } from 'src/entities/chat/chat.entity';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RedisClientType } from 'redis';

@ApiBearerAuth()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  },
  namespace: '/',
  transports: ['websocket'],
})
@ApiTags('Chat')
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  private clientMap: Map<string, Socket> = new Map();

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        client.disconnect(true);
        this.logger.warn('Client disconnected: No token provided.');
        return;
      }
  
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      const payload = await this.jwtService.verifyAsync(cleanToken);
      const userId = payload.sub.toString();
  
      await this.redisClient.set(`user:${userId}`, client.id, {
        EX: 1800,
      });
  
      this.logger.log(`Client connected: ${client.id} for user ${userId}`);

    } catch (error: any) {
      this.logger.error(`Connection handling error: ${error.message}`);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      for (const key of await this.redisClient.keys('user:*')) {
        const socketId = await this.redisClient.get(key);
        if (socketId === client.id) {
          await this.redisClient.del(key);
          this.logger.log(`Removed user id: ${key.split(':')[1]} from Redis`);
          break;
        }
      }
    } catch (error) {
      this.logger.error(`Error during disconnect: ${error.message}`);
    }
  }

  @SubscribeMessage('send')
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiBody({ type: () => Object })
  async handleMessage(@MessageBody() data: Partial<Message>, client: Socket) {
    data.sent_at = new Date();
    const message = await this.chatService.create(data);
    this.sendMSGtoReceiver(message);
  }

  private async sendMSGtoReceiver(message: Message) {
    const sender = await this.usersService.findOneById(message.sender.user_id);
    const receiver = await this.usersService.findOneById(message.receiver.user_id);
    
    const receivedMsg = {
      id: message.message_id,
      message_text: message.message_text,
      sent_at: message.sent_at,
      sender: {
        user_id: sender.user_id,
        username: sender.username,
        first_name: sender.first_name,
        last_name: sender.last_name,
      },
      receiver: {
        user_id: receiver.user_id,
        username: receiver.username,
        first_name: receiver.first_name,
        last_name: receiver.last_name,
      },
    };
    
    this.logger.log(`Sending message from ${sender.username} to receiver: ${receiver.username}`);
    
    // Invia il messaggio SOLO al destinatario
    const recipientSocketId = await this.redisClient.get(`user:${receiver.user_id}`);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receive', receivedMsg);
      this.logger.log(`Message sent to receiver ${receiver.username} via socket ${recipientSocketId}`);
    } else {
      this.logger.warn(`Recipient ${receiver.username} with id ${receiver.user_id} is not online`);
    }
    
    // RIMOSSO: Non inviare più il messaggio al mittente per evitare duplicati
  }

  
  @SubscribeMessage('receive')
  @ApiOperation({ summary: 'Receive a chat message' })
  handleReceive(@MessageBody() data: any) {
    // Questo metodo è solo un placeholder per la sottoscrizione
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    try {
      if (client.handshake.auth && client.handshake.auth.token) {
        const auth_token = client.handshake.auth.token as string;
        return auth_token.startsWith('Bearer ') ? auth_token.slice(7) : auth_token;
      }

      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        return null;
      }

      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer') {
        return null;
      }

      return token;
    } catch (error) {
      this.logger.error(`Error extracting token: ${error.message}`);
      return null;
    }
  }
}