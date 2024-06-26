import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(MessageEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
