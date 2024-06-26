import { setSeederFactory } from 'typeorm-extension';
import { PostCommentEntity } from '../../posts/comments/entities/comment.entity';

export default setSeederFactory(PostCommentEntity, (faker) => {
  const postComment = new PostCommentEntity();
  postComment.content = faker.lorem.paragraph();
  postComment.userId = 1; // This is a dummy value, you can change it to a valid user id
  postComment.postId = 1; // This is a dummy value, you can change it to a valid post id
  return postComment;
});
