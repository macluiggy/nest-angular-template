import { PartialType } from '@nestjs/swagger';
import { CreateAiApiDto } from './create-ai-api.dto';

export class UpdateAiApiDto extends PartialType(CreateAiApiDto) {}
