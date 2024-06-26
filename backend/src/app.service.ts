import { Injectable } from '@nestjs/common';

export const HELLO_WORLD_MESSAGE_FROM_APP_SERVICE =
  'Hello World! from vercel!!!';
@Injectable()
export class AppService {
  getHello(): string {
    return HELLO_WORLD_MESSAGE_FROM_APP_SERVICE;
  }
}
