import { Module, ModuleMetadata } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';

const likeModuleMetadata: ModuleMetadata = {
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [LikesService],
};
@Module(likeModuleMetadata)
export class LikesModule {}
