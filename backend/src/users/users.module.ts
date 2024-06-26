import { Module, ModuleMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { UsersController } from './users.controller';
import { AiApiService } from '../ai-api/ai-api.service';
import { FileStorageService } from '../file-storage/file-storage.service';
// import { LangService } from '../lang/lang.service';
import { FollowsModule } from './follows/follows.module';

const userModuleMetadata: ModuleMetadata = {
  imports: [TypeOrmModule.forFeature([UserEntity]), FollowsModule], // provides the User entity to the UsersService with the repository injection
  providers: [UsersService, AiApiService, FileStorageService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
};
@Module(userModuleMetadata)
export class UsersModule {}

export { userModuleMetadata };
