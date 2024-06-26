import { setSeederFactory } from 'typeorm-extension';
import { PostEntity } from '../../posts/entities/post.entity';

export default setSeederFactory(PostEntity, (faker) => {
  const post = new PostEntity();
  post.title = faker.lorem.sentence();
  post.content = faker.lorem.paragraph();
  post.userId = 1; // This is a dummy value, you can change it to a valid user id
  return post;
});
