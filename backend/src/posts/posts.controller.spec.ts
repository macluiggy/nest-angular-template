import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { CreatePostDto } from './dto/create-post.dto';
import ApiStandardResponse from '../common/interceptors/api-response';

// Mock implementation of the Post repository
const mockPostRepository = {
  find: vi.fn(),
  findOneBy: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

// Mock implementation of the Request object
const mockRequest = {
  preferredLanguage: 'en', // Set the desired language for testing
};

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;
  let dto: CreatePostDto;

  beforeEach(async () => {
    dto = new CreatePostDto();
    dto.title = 'John Doe';
    dto.content = 'Hello, World!';
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
        {
          provide: 'REQUEST',
          useValue: mockRequest,
        },
        {
          provide: PostsService,
          useValue: {
            create: vi.fn().mockResolvedValue(dto),
            findAll: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
            findUserPosts: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = await module.resolve<PostsController>(PostsController);
    service = await module.resolve<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    expect(
      await controller.create(dto, {
        user: { id: 1 },
      } as any),
    ).toStrictEqual(new ApiStandardResponse(dto, 'Post created successfully'));
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  // Add more tests for your controller and service methods
});
