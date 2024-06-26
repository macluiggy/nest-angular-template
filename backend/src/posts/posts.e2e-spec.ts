import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { typeOrmConfig } from '../db/config/typeorm.config';
import getApiEndpoint from '../common/utils/getApiEndpoint';
import { it } from 'vitest';
import { UserEntity } from '../users/users.entity';
import { PostsModule } from './posts.module';
import { UsersModule } from '../users/users.module';
import { PostEntity } from './entities/post.entity';
import generatePost from './generate.post';
import { signInUser } from '../auth/utils/singInUser';
import { AuthModule } from '../auth/auth.module';
import setupTestingModule from '../../test/setUpTestingModule';
import { Repository } from 'typeorm';

describe('Post Controller (e2e)', () => {
  let app: INestApplication;
  let user: UserEntity;
  let post: PostEntity;
  let accessToken: string;
  let postsRepository: Repository<PostEntity>;

  beforeAll(async () => {
    const testingModule = await setupTestingModule({
      imports: [
        PostsModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule,
        AuthModule,
      ],
    });
    app = testingModule.app;
    const module = testingModule.testingModule;

    const data = await signInUser(app);
    accessToken = data.accessToken;

    user = data.user;

    post = generatePost({ userId: user.id });

    postsRepository = module.get(getRepositoryToken(PostEntity));
  });

  it('/post POST, should create a post', async () => {
    const endpoint = getApiEndpoint('posts');

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send(post);

    return expect(res.status).toBe(201);
  });

  it('/post GET, should get all posts', async () => {
    const endpoint = getApiEndpoint('posts');

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('/post/:id GET, should get a post', async () => {
    const createdPost = await postsRepository.findOne({
      where: { title: post.title },
    });

    const endpoint = getApiEndpoint(`posts/${createdPost.id}`);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe(post.title);
  });

  it('/post/:id PUT, should update a post', async () => {
    const createdPost = await postsRepository.findOne({
      where: { title: post.title },
    });

    const endpoint = getApiEndpoint(`posts/${createdPost.id}`);

    const res = await request(app.getHttpServer())
      .patch(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send({ title: 'updated title' });

    expect(res.status).toBe(200);
  });

  // find post by user id
  it('/post/user/:userId GET, should get all posts by user id', async () => {
    const endpoint = getApiEndpoint(`posts/user/${user.id}`);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .query({ page: 1, limit: 10 })
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeInstanceOf(Array);
    expect(res.body.data.total).toBeGreaterThan(0);
  });

  it('/post/random GET, should get random posts', async () => {
    const endpoint = getApiEndpoint('posts/random');

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .query({ page: 1, limit: 10 })
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.statusCode).toBe(200);
    // expect(res.status).toBe(200);
    // expect(res.body.data.items).toBeInstanceOf(Array);
    // expect(res.body.data.total).toBeGreaterThan(0);
  });

  afterAll(async () => {
    // delete the post
    const createdPost = await postsRepository.findOne({
      where: { title: post.title },
    });

    if (createdPost) {
      await postsRepository.remove(createdPost);
    }

    await app.close();
  });
});
