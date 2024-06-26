import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CORS_ORIGINS } from '../common/constants';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST'],
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    message: {
      senderId: number;
      receiverId: number;
      content: string;
    },
  ) {
    const { senderId, receiverId, content } = message;
    await this.messagesService.saveMessage({
      senderId,
      receiverId,
      content,
    });

    this.server.emit('receiveMessage', message);
  }
}
