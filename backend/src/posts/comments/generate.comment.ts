import { PostCommentEntity } from './entities/comment.entity';
import { faker } from '@faker-js/faker';

export default function generateComment({
  postId,
  userId,
  parentCommentId = null,
}): PostCommentEntity {
  const comment = new PostCommentEntity();
  comment.content = faker.lorem.paragraphs(3);
  comment.postId = postId;
  comment.userId = userId;
  comment.parentCommentId = parentCommentId;
  return comment;
}
