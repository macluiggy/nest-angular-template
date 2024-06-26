import { Module, ModuleMetadata } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';

export const messagesModuleMetadata: ModuleMetadata = {
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  imports: [TypeOrmModule.forFeature([MessageEntity])],
};
@Module(messagesModuleMetadata)
export class MessagesModule {}
