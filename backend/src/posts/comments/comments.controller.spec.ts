import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PostCommentEntity } from './entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        {
          provide: 'REQUEST',
          useValue: {},
        },
        {
          provide: getRepositoryToken(PostCommentEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
