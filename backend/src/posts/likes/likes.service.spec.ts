import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { DataSource } from 'typeorm';

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: 'REQUEST',
          useValue: {},
        },
        {
          provide: 'LikeRepository',
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
