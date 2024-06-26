import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  Scope,
  Inject,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import ApiStandardResponse from '../common/interceptors/api-response';
import getMessages from '../lang/getMessages';
import Lang from '../lang/lang.type';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import getApiEndpoint from '../common/utils/getApiEndpoint';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: getApiEndpoint('users'),
  scope: Scope.REQUEST,
})
export class UsersController {
  private messages: Lang;
  constructor(
    private readonly userService: UsersService,
    @Inject(REQUEST) private request: Request,
  ) {
    const lang = this.request['preferredLanguage'];
    this.messages = getMessages(lang);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() userDTO: UserDto) {
    const data = await this.userService.create(userDTO);

    return new ApiStandardResponse(data, this.messages.USER.CREATED);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  async update(
    @Param('id') id: number,
    @Body() userDTO: UserDto,
    @Req() req: Request & { user: any },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            // max size in bytes
            maxSize: 1024 * 1024,
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
    const preferredLanguage = req.user.preferredLanguage;
    const messages = getMessages(preferredLanguage);
    userDTO.profileImage = profileImage;
    return new ApiStandardResponse(
      await this.userService.update(id, userDTO),
      messages.USER.UPDATED,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.userService.remove(id);
  }
}
