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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { API_VERSION } from '../common/constants';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(`api/${API_VERSION}/users`)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() userDTO: UserDto) {
    return await this.userService.create(userDTO);
  }

  @Get()
  async findAll(@Req() req: any) {
    console.log(req.user);

    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDTO: UserDto) {
    return await this.userService.update(id, userDTO);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
