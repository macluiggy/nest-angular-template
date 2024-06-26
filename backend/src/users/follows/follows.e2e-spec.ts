import { INestApplication } from '@nestjs/common';
import setupTestingModule from '../../../test/setUpTestingModule';
import { signInUser } from '../../auth/utils/singInUser';
import { followsModuleMetadata } from './follows.module';
import getApiEndpoint from '../../common/utils/getApiEndpoint';
import request from 'supertest';
import { UserEntity } from '../users.entity';
import { Repository } from 'typeorm';
import generateUser from '../generate.user';

describe('Follow e2e', () => {
  let app: INestApplication;
  let user: UserEntity;
  let accessToken: string;
  let userRespository: Repository<UserEntity>;
  let randomUser: UserEntity;

  beforeAll(async () => {
    const testingModule = await setupTestingModule(followsModuleMetadata);
    const module = testingModule.testingModule;
    app = testingModule.app;

    const data = await signInUser(app);
    accessToken = data.accessToken;

    user = data.user;

    userRespository = module.get('UserEntityRepository');
    randomUser = generateUser();
    await userRespository.save(randomUser);
  });

  it('/users GET, should get all users', async () => {
    const endpoint = getApiEndpoint('users');

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('/user/:userId/follow/:otherUserId POST, should follow a user', async () => {
    const endpoint = getApiEndpoint(
      `follows/user/${user.id}/follow/${randomUser.id}`,
    );

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
  });

  it('/user/:userId/following GET, should get the users that a user is following', async () => {
    const endpoint = getApiEndpoint(`follows/user/${user.id}/following`);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });
    const body = res.body;

    // find the user that was followed
    const followedUser = body.data.find(
      (u: UserEntity) => +u.id === +randomUser.id,
    );

    expect(followedUser).toBeDefined();
    expect(followedUser.id).toBe(randomUser.id);
    expect(followedUser.email).toBe(randomUser.email);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('/user/:userId/followers GET, should get the followers of a user', async () => {
    const endpoint = getApiEndpoint(`follows/user/${randomUser.id}/followers`);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    const body = res.body;

    // find the user that was followed
    const followerUser = body.data.find((u: UserEntity) => +u.id === +user.id);

    expect(followerUser).toBeDefined();
    expect(followerUser.id).toBe(user.id);
    expect(followerUser.email).toBe(user.email);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('/user/:userId/following/:otherUserId GET, should check if the logged-in user is following another user', async () => {
    const endpoint = getApiEndpoint(
      `follows/user/${user.id}/following/${randomUser.id}`,
    );

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBe(true);
  });

  it('/user/:userId/unfollow/:otherUserId DELETE, should unfollow a user', async () => {
    const endpoint = getApiEndpoint(
      `follows/user/${user.id}/unfollow/${randomUser.id}`,
    );

    const res = await request(app.getHttpServer())
      .delete(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.affected).toBe(1);
  });

  it('/user/:userId/following/:otherUserId GET, should check if the logged-in user is following another user', async () => {
    const endpoint = getApiEndpoint(
      `follows/user/${user.id}/following/${randomUser.id}`,
    );

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBe(false);
  });

  afterAll(async () => {
    // delete data from the database
    await userRespository.remove(randomUser);
    await app.close();
  });
});
