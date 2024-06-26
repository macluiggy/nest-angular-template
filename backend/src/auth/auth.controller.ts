import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req /**, UseGuards */,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/users.dto';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import ApiStandardResponse from '../common/interceptors/api-response';
import getApiEndpoint from '../common/utils/getApiEndpoint';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { GoogleGuard } from './guards/google.guard';
import envVariables from '../common/envVariables';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller(getApiEndpoint('auth'))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {
    console.log('google login');

    // Initiates the Google OAuth2 login flow
  }

  // http://localhost:3000/auth/google/callback
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    // Handles the Google OAuth2 callback
    const user = req.user;

    // Here you would usually create a JWT token and send it to the user
    const dataToken = await this.authService.singInWithGoogle(user);
    const token = dataToken.accessToken;

    if (token) {
      res.redirect(`${envVariables.frontedUrl}/login/success?token=${token}`);
    } else {
      res.redirect(`${envVariables.frontedUrl}/login/failure`);
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }
  // @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: Request & { user: any }) {
    const body = req.body;
    const user = {
      email: body.email,
      password: body.password,
    };
    const data = await this.authService.signIn(user);
    return new ApiStandardResponse(data);
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImage'))
  async signUp(
    @Body() user: UserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2,
            message(maxSize) {
              return `File too large. Max size is ${maxSize}`;
            },
          }),
          new FileTypeValidator({
            // regex that starts with image and ends with png, jpg, or jpeg
            fileType: /^image\/(png|jpg|jpeg)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    profileImage: Express.Multer.File,
  ) {
    user.profileImage = profileImage;
    const data = await this.authService.singUp(user);
    return new ApiStandardResponse(data, 'User created successfully');
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // endpoint to get the decoded user from the JWT
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request & { user: any }) {
    return req.user;
  }
}
