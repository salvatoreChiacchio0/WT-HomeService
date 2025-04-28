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

@ApiBearerAuth()
@WebSocketGateway()
@ApiTags('Chat')
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  private clientMap: Map<string, Socket> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        throw new Error('No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub.toString(); 


      this.clientMap.set(userId, client);

      const { sockets } = this.io.sockets;
      this.logger.debug(`Number of connected clients: ${sockets.size}`);
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      client.disconnect(true); 
    }
  }

  handleDisconnect(client: Socket) {


    for (const [userId, socket] of this.clientMap.entries()) {
      if (socket === client) {
        this.clientMap.delete(userId);
        this.logger.log(`Removed user id: ${userId} from client map`);
        break;
      }
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

  private sendMSGtoReceiver(message: Message) {
    const receivedMsg = {
      id: message.message_id,
      message: message.message_text,
      sent_at: message.sent_at,
      senderId: message.sender,
      receiverId: message.receiver,
    };

    this.logger.log(`Sending message to receiver: ${message.receiver}`);
    const recipientSocket = this.clientMap.get(receivedMsg.receiverId.toString());
    if (recipientSocket) {
      recipientSocket.emit('receive', receivedMsg);
    } else {
      this.logger.warn(`Recipient with id ${receivedMsg.receiverId} is not online`);
    }
  }

  @SubscribeMessage('receive')
  @ApiOperation({ summary: 'Receive a chat message' })
  handleReceive(@MessageBody() data: any) {
    // Questo metodo è solo un placeholder per la sottoscrizione
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      return null;
    }

    return token;
  }
}