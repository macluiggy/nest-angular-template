import { Module, ModuleMetadata } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './entities/follow.entity';
import { FileStorageService } from '../../file-storage/file-storage.service';

const followsModuleMetadata: ModuleMetadata = {
  controllers: [FollowsController],
  providers: [FollowsService, FileStorageService],
  imports: [TypeOrmModule.forFeature([FollowEntity])],
};
@Module(followsModuleMetadata)
export class FollowsModule {}

export { followsModuleMetadata };
