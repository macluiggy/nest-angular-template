import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import setupTestingModule from '../../../test/setUpTestingModule';
import { commentsModuleMetadata } from './comments.module';
import { signInUser } from '../../auth/utils/singInUser';
import { UserEntity } from '../../users/users.entity';
import generatePost from '../generate.post';
import { PostEntity } from '../entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import getApiEndpoint from '../../common/utils/getApiEndpoint';
import generateComment from './generate.comment';

describe('Comment Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let user: UserEntity;
  let post: PostEntity;
  let postsRepository: Repository<PostEntity>;
  const baseUrl = 'post-comments';

  beforeAll(async () => {
    const testingModule = await setupTestingModule(commentsModuleMetadata);
    app = testingModule.app;
    const module = testingModule.testingModule;

    const data = await signInUser(app);
    accessToken = data.accessToken;

    user = data.user;

    post = generatePost({ userId: user.id });

    postsRepository = module.get(getRepositoryToken(PostEntity));

    // create a post
    post = await postsRepository.save(post);
  });

  let parentCommentId: number;
  it('/post-comments POST, should create a comment', async () => {
    // create a comment
    const comment = generateComment({ postId: post.id, userId: user.id });

    const endpoint = getApiEndpoint(`${baseUrl}`);

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send(comment);

    parentCommentId = res.body.data.id;

    return expect(res.status).toBe(201);
  });

  it('/post-comments POST, should create a child comment', async () => {
    // create a child comment
    const comment = generateComment({
      postId: post.id,
      userId: user.id,
      parentCommentId,
    });

    const endpoint = getApiEndpoint(`${baseUrl}`);

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send(comment);

    return expect(res.status).toBe(201);
  });

  it('/post-comments/post/:postId GET, should get all comments by post id', async () => {
    const endpoint = getApiEndpoint(`${baseUrl}/post/${post.id}`);

    const res = await request(app.getHttpServer()).get(endpoint);

    expect(res.status).toBe(200);
    // the total number of comments should be 1
    expect(res.body.data.total).toBe(1);
    // it should have 1 item and the item should have a parentCommentId of null
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].parentCommentId).toBeNull();
  });

  afterAll(async () => {
    // delete the post
    await postsRepository.delete(post.id);

    await app.close();
  });
});
