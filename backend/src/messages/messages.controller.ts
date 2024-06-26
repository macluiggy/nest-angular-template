import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import getApiEndpoint from '../common/utils/getApiEndpoint';

@Controller({
  path: getApiEndpoint('messages'),
})
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('sender/:senderId/receiver/:receiverId')
  getMessages(@Param() params: any) {
    const { senderId = 0, receiverId = 0 } = params;
    return this.messagesService.getMessages(+senderId, +receiverId);
  }
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.saveMessage(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
