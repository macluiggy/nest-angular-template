import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/users.dto';
import { UsersService } from '../users/users.service';
import { DEFAULT_LANG } from '../lang';
import envVariables from '../common/envVariables';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (user && isValidPassword) {
      delete user.password;
      return user;
    }
    return null;
  }

  async singInWithGoogle(user: any) {
    let userFromDB = await this.userService.findByEmail(user.email);
    if (!userFromDB) {
      userFromDB = await this.userService.create({
        email: user.email,
        username: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
    const preferredLanguage = userFromDB['preferredLanguage'] || DEFAULT_LANG;
    const payload = {
      ...userFromDB,
      preferredLanguage: preferredLanguage || DEFAULT_LANG,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: envVariables.jwtSecret,
      expiresIn: envVariables.jwtExpiresIn,
      // expiresIn: '10s', // for testing
      // audience: process.env.APP_URL,
    });

    return {
      accessToken,
      user: userFromDB,
    };
  }

  async signIn(user: { email: string; password: string }) {
    const userFromDB = await this.userService.findByEmail(user.email);

    if (!userFromDB) {
      throw new NotFoundException('User not found');
    }
    const preferredLanguage = userFromDB?.['preferredLanguage'] || DEFAULT_LANG;
    const isValidPassword = await this.userService.checkPassword(
      user.password,
      userFromDB.password,
    );
    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    delete userFromDB.password;
    delete userFromDB.createdAt;
    delete userFromDB.updatedAt;
    delete userFromDB.isPasswordReset;
    delete userFromDB.deletedAt;
    delete userFromDB.phone;

    const payload = {
      ...userFromDB,
      preferredLanguage: preferredLanguage || DEFAULT_LANG,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: envVariables.jwtSecret,
      expiresIn: envVariables.jwtExpiresIn,
      // expiresIn: '10s', // for testing
      // audience: process.env.APP_URL,
    });

    return {
      accessToken,
      user: userFromDB,
    };
  }

  async singUp(user: UserDto) {
    return await this.userService.create(user);
  }

  async logout() {
    return { message: 'Logout successfully' };
  }
}
