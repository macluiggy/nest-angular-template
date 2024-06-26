import { Module } from '@nestjs/common';
import { AiApiService } from './ai-api.service';
import { AiApiController } from './ai-api.controller';

@Module({
  controllers: [AiApiController],
  providers: [AiApiService],
})
export class AiApiModule {}
