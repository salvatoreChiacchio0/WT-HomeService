import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Message } from 'src/entities/chat/chat.entity';
import { Repository } from 'typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(ChatService.name);

  async findAllChatsByUser(userId: number) {
    const messages = await this.messageRepository.find({
      where: [
        { sender: { user_id: userId } },
        { receiver: { user_id: userId } },
      ],
      select: ['message_id', 'message_text', 'sent_at', 'sender', 'receiver'], // Assicurati di selezionare solo i campi necessari
      relations: ['sender', 'receiver'],
      order: { sent_at: 'ASC' },
    });

    const chatsMap = new Map<number, any[]>();

    for (const message of messages) {
      const otherUser =
        message.sender.user_id === userId
          ? message.receiver
          : message.sender;

      if (!chatsMap.has(otherUser.user_id)) {
        chatsMap.set(otherUser.user_id, []);
      }

      const simplifiedMessage = {
        id: message.message_id,
        message: message.message_text,
        sent_at: message.sent_at,
        senderId: message.sender.user_id,
        receiverId: message.receiver.user_id,
      };

      (chatsMap.get(otherUser.user_id) || []).push(simplifiedMessage);
    }

    const chats = Array.from(chatsMap.entries()).map(([otherUserId, messages]) => ({
      userId: otherUserId,
      messages,
    }));

    return chats;
  }
  

  async create(createMessageDto: Partial<Message>): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    const savedMessage = await this.messageRepository.save(message);

    // Create notification for the receiver
    await this.notificationsService.create({
      type: 'Message',
      text: `New message received`,
      user: message.receiver,
      senderId: message.sender.user_id.toString(),
    });

    return savedMessage;
  }

}