import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { UsersController } from './users.controller';
// import { LangService } from '../lang/lang.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // provides the User entity to the UsersService with the repository injection
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
