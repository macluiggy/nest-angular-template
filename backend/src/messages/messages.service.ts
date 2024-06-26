import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}
  saveMessage(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
    // return 'This action adds a new message';
  }

  async getMessages(senderId: number, receiverId: number) {
    // return await this.messageRepository.find({
    //   where: [
    //     { senderId, receiverId },
    //     { senderId: receiverId, receiverId: senderId },
    //   ],
    // });
    const queryBuilder = this.messageRepository
      .createQueryBuilder('messages')
      .where('sender_id = :senderId AND receiver_id = :receiverId', {
        senderId,
        receiverId,
      })
      .orWhere('sender_id = :receiverId AND receiver_id = :senderId', {
        senderId,
        receiverId,
      })
      .leftJoin('messages.sender', 'sender')
      .addSelect(['sender.id', 'sender.username'])
      .leftJoin('messages.receiver', 'receiver')
      .addSelect(['receiver.id', 'receiver.username']);
    return await queryBuilder.getMany();
  }

  create(createMessageDto: CreateMessageDto) {
    return this.saveMessage(createMessageDto);
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    console.log(updateMessageDto);

    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
