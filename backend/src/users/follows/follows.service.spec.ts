import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FollowEntity } from './entities/follow.entity';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { vi } from 'vitest';

describe('FollowsService', () => {
  let service: FollowsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: getRepositoryToken(FollowEntity),
          useValue: {
            createQueryBuilder: vi.fn().mockReturnThis(),
            leftJoinAndSelect: vi.fn().mockReturnThis(),
            addSelect: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            getRawMany: vi.fn().mockResolvedValue([]),
            select: vi.fn().mockReturnThis(),
            andWhere: vi.fn().mockReturnThis(),
            getQuery: vi.fn().mockReturnThis(),
            leftJoin: vi.fn().mockReturnThis(),
          },
        },
        {
          provide: FileStorageService,
          useValue: {
            getSignedUrl: vi
              .fn()
              .mockResolvedValue('http://example.com/image.jpg'),
          },
        },
      ],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
  });

  it('should build and execute correct query', async () => {
    const userId = 1;

    await service.getUserFollowers(userId);

    const followRepository = module.get(getRepositoryToken(FollowEntity));
    expect(followRepository.createQueryBuilder).toHaveBeenCalledWith('f2');
    expect(followRepository.addSelect).toHaveBeenCalledWith([
      'user.id',
      'user.username',
      'user.email',
      'user.profileImageKey',
      'user.firstName',
    ]);
    expect(followRepository.where).toHaveBeenCalledWith(
      'f.followingId = :userId',
      { userId },
    );
    expect(followRepository.getRawMany).toHaveBeenCalled();
  });

  // Add more tests here
});
