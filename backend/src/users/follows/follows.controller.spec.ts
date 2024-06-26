import { Test, TestingModule } from '@nestjs/testing';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { vi } from 'vitest';

describe('FollowsController', () => {
  let controller: FollowsController;
  let service: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowsController],
      providers: [
        {
          provide: FollowsService,
          useValue: {
            isUserFollowing: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<FollowsController>(FollowsController);
    service = module.get<FollowsService>(FollowsService);
  });

  it('should call isUserFollowing with correct parameters', async () => {
    const loggedInUserId = 1;
    const otherUserId = 2;

    await controller.isUserFollowing(loggedInUserId, otherUserId);

    expect(service.isUserFollowing).toHaveBeenCalledWith(
      loggedInUserId,
      otherUserId,
    );
  });
});
