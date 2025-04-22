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
import { chatDTO } from 'src/DTO/chat-dto';
import { ChatService } from './chat.service';
import { Message } from 'src/entities/chat/chat.entity';

@ApiBearerAuth()
@WebSocketGateway()
@ApiTags('Chat')
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  private clientMap: Map<string, Socket> = new Map();

  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id: ${client.id} disconnected`);


    for (const [userId, socket] of this.clientMap.entries()) {
      if (socket === client) {
        this.clientMap.delete(userId);
        this.logger.log(`Removed user id: ${userId} from client map`);
        break;
      }
    }
  }

  @SubscribeMessage('identify')
  @ApiOperation({ summary: 'Identify the client with a user ID' })
  @ApiBody({ description: 'id', type: String })
  handleIdentify(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.clientMap.set(data.userId.toString(), client);

    this.logger.log(`Client id: ${client.id} identified as user id: ${data.userId}`);

    client.emit('identified', { message: 'Successfully identified.' });
  }

  @SubscribeMessage('chat')
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiBody({ type: () => Object })
  async handleMessage(@MessageBody() data: Partial<Message>, client: Socket) {
    data.sent_at = new Date();
    const message = await this.chatService.create(data);

    this.sendToRecipient(message);
  }

  private sendToRecipient(message: Message) {

    this.logger.debug(message)
    const receivedMsg = {
      id: message.message_id,
      message: message.message_text,
      sent_at: message.sent_at,
      senderId: message.sender,
      receiverId: message.receiver,
    };


    this.logger.debug('Client map:', {
      size: this.clientMap.size,
      entries: Array.from(this.clientMap.entries()).map(([userId, socket]) => ({
        userId,
        socketId: socket.id,
      })),
    });
    const recipientSocket = this.clientMap.get(
      receivedMsg.receiverId.toString(),
    );
    if (recipientSocket) {
      recipientSocket.emit('receive', receivedMsg);
      this.logger.log(
        `Message sent to recipient id: ${receivedMsg.receiverId}`,
      );
    } else {
      this.logger.warn(
        `Recipient with id ${receivedMsg.receiverId} is not connected.`,
      );
    }
  }

  @SubscribeMessage('receive')
  @ApiOperation({ summary: 'Receive a chat message' })
  handleReceive(@MessageBody() data: any) {
    //metodo usato solo per la sottoscrizione non ci serve implementare niente
  }
}
