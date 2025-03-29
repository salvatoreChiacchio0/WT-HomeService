import { Logger } from "@nestjs/common";
import {MessageBody, OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit,SubscribeMessage,WebSocketGateway,WebSocketServer} from "@nestjs/websockets";
import { Server } from "socket.io";
import { chatDTO } from "src/DTO/chat-dto";

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage("chat")
  handleMessage(@MessageBody() data: chatDTO) {
    this.logger.debug(data)
    this.logger.log(`Message received from client id: ${data.senderId}`);
    this.logger.debug(`Payload: ${data.message}`);
    return data.message + "Sender"
  }
}

