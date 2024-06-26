import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { vi } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';

const mockPostRepository = {
  find: vi.fn(),
  findOneBy: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockRequest = {
  preferredLanguage: 'en',
};
describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: 'REQUEST',
          useValue: mockRequest,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = await module.resolve<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
