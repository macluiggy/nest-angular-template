import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import getApiEndpoint from '../common/utils/getApiEndpoint';
import { it } from 'vitest';
import { UserEntity } from '../users/users.entity';
import { userModuleMetadata } from '../users/users.module';
import { USERNAME_FOR_TESTING, signInUser } from '../auth/utils/singInUser';
import setupTestingModule from '../../test/setUpTestingModule';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let user: UserEntity;
  let accessToken: string;

  beforeAll(async () => {
    const testingModule = await setupTestingModule(userModuleMetadata);
    app = testingModule.app;

    const data = await signInUser(app);
    accessToken = data.accessToken;

    user = data.user;
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

  it('/users/:id GET, should get a user', async () => {
    const endpoint = getApiEndpoint(`users/${user.id}`);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(user.username);
  });

  it('/users/:id PUT, should update a user', async () => {
    const endpoint = getApiEndpoint(`users/${user.id}`);

    const res = await request(app.getHttpServer())
      .put(endpoint)
      .set({
        authorization: `Bearer ${accessToken}`,
      })
      .send({ username: USERNAME_FOR_TESTING });

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
