import {
  MiddlewareConsumer,
  Module,
  ModuleMetadata,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DeleteDummyUserMiddleware } from './middleware/delete.dummy.user';
import { API_VERSION } from '../common/constants';
import { GoogleStrategy } from './strategies/google.strategy';

const authModuleMetadata: ModuleMetadata = {
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
};
@Module(authModuleMetadata)
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeleteDummyUserMiddleware).forRoutes({
      path: `api/${API_VERSION}/auth/signup`,
      method: RequestMethod.POST,
    });
  }
}

export { authModuleMetadata };
