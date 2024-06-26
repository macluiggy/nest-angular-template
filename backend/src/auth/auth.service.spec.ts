import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { vi } from 'vitest';

// Mock implementation of the UsersService
const mockUsersService = {
  findByUsername: vi.fn(),
  findByEmail: vi.fn(),
  checkPassword: vi.fn(),
  create: vi.fn(),
};

// Mock implementation of the JwtService
const mockJwtService = {
  sign: vi.fn().mockReturnValue('mock_access_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests for your AuthService methods
});
