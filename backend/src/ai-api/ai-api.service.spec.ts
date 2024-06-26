import { Test, TestingModule } from '@nestjs/testing';
import { AiApiService } from './ai-api.service';

describe('AiApiService', () => {
  let service: AiApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiApiService],
    }).compile();

    service = module.get<AiApiService>(AiApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
