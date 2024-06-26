import { setSeederFactory } from 'typeorm-extension';
import { Like } from '../../posts/likes/entities/like.entity';

export default setSeederFactory(Like, () => {
  const like = new Like();
  like.userId = 2; // This is a dummy value, you can change it to a valid user id
  like.postId = 1; // This is a dummy value, you can change it to a valid post id
  return like;
});
