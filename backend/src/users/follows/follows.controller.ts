import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import getApiEndpoint from '../../common/utils/getApiEndpoint';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('follows')
@UseGuards(JwtAuthGuard)
@Controller({
  path: getApiEndpoint('follows'),
})
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  create(@Body() createFollowDto: CreateFollowDto) {
    return this.followsService.create(createFollowDto);
  }

  @Get()
  findAll() {
    return this.followsService.findAll();
  }

  @Public()
  @Get('user/:userId/followers/count')
  async getFollowersCount(@Param('userId') userId: number) {
    const count = await this.followsService.getFollowersCount(+userId);
    return { count };
  }

  @Public()
  @Get('user/:userId/following/count')
  async getFollowingCount(@Param('userId') userId: number) {
    const count = await this.followsService.getFollowingCount(+userId);
    return { count };
  }

  @Post('user/:userId/follow/:otherUserId')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({
    name: 'otherUserId',
    type: Number,
    description: 'ID of the user to follow',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of the follower',
  })
  @ApiResponse({ status: 200, description: 'Follow successful' })
  follow(
    @Param('otherUserId') followedId: number,
    @Param('userId') followerId: number,
  ) {
    return this.followsService.follow(+followedId, +followerId);
  }

  @Delete('user/:userId/unfollow/:otherUserId')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({
    name: 'otherUserId',
    type: Number,
    description: 'ID of the user to unfollow',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of the follower',
  })
  @ApiResponse({ status: 200, description: 'Unfollow successful' })
  unfollow(
    @Param('otherUserId') followedId: number,
    @Param('userId') followerId: number,
  ) {
    return this.followsService.unfollow(+followedId, +followerId);
  }

  @Public()
  @ApiOperation({ summary: 'Get the users that a user is following' })
  @Get('user/:userId/following')
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of the user',
  })
  @ApiResponse({ status: 200, description: 'Get following users successful' })
  getFollowing(@Param('userId') userId: number) {
    return this.followsService.getUserFollowing(+userId);
  }

  @Public()
  @ApiOperation({ summary: 'Get the followers of a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Get followers successful' })
  @Get('user/:userId/followers')
  getFollowers(@Param('userId') userId: number) {
    return this.followsService.getUserFollowers(+userId);
  }

  @Public()
  @ApiOperation({
    summary: 'Check if the logged-in user is following another user',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of the logged-in user',
  })
  @ApiParam({
    name: 'otherUserId',
    type: Number,
    description: 'ID of the other user',
  })
  @ApiResponse({ status: 200, description: 'Check successful' })
  @Get('user/:userId/following/:otherUserId')
  isUserFollowing(
    @Param('userId') loggedInUserId: number,
    @Param('otherUserId') otherUserId: number,
  ) {
    return this.followsService.isUserFollowing(+loggedInUserId, +otherUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followsService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followsService.remove(+id);
  }
}
