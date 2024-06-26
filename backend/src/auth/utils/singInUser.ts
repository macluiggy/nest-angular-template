import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import getApiEndpoint from '../../common/utils/getApiEndpoint';

const EMAIL_FOR_TESTING = 'user-for-testing@test.com';
const PASSWORD_FOR_TESTING = '123456';
const USERNAME_FOR_TESTING = 'user-for-testing';
const FULL_NAME_FOR_TESTING = 'Test User For Testing';

export {
  EMAIL_FOR_TESTING,
  PASSWORD_FOR_TESTING,
  USERNAME_FOR_TESTING,
  FULL_NAME_FOR_TESTING,
};

type SingInUserResponse = {
  accessToken: string;
  user: any;
};

class Singleton {
  private static instance: SingInUserResponse | null = null;

  private constructor(private app: INestApplication) {}

  public static async getInstance(
    app: INestApplication,
  ): Promise<SingInUserResponse> {
    if (!this.instance) {
      const endpoint = getApiEndpoint('auth/signin');
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ email: EMAIL_FOR_TESTING, password: PASSWORD_FOR_TESTING });

      this.instance = response.body?.data;
    }

    return this.instance;
  }
}

export async function signInUser(
  app: INestApplication,
): Promise<SingInUserResponse> {
  return Singleton.getInstance(app);
}
