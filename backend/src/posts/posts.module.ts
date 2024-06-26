import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    LikesModule,
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
