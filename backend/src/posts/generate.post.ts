import { PostEntity } from './entities/post.entity';
import { faker } from '@faker-js/faker';

export default function generatePost({ userId }): PostEntity {
  const post = new PostEntity();
  post.title = faker.lorem.sentence();
  post.content = faker.lorem.paragraphs(3);
  post.userId = userId;
  return post;
}
