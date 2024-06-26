import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { vi } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { DataSource } from 'typeorm';
import { MOCK_REQUEST } from '../common/tests/constants';
import { AiApiService } from '../ai-api/ai-api.service';
import { FileStorageService } from '../file-storage/file-storage.service';

const mockUsersRepository = {
  find: vi.fn(),
  findOneBy: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
        { provide: DataSource, useValue: {} },
        { provide: 'REQUEST', useValue: MOCK_REQUEST },
        AiApiService,
        FileStorageService,
        {
          provide: AiApiService,
          useValue: {
            getResponse: vi.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
