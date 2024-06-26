import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import getApiEndpoint from '../../common/utils/getApiEndpoint';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@Controller({
  path: getApiEndpoint('likes'),
})
@UseGuards(JwtAuthGuard)
@ApiTags('likes')
@ApiBearerAuth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: Request) {
    const user = req['user'];
    createLikeDto.userId = user.id;
    return this.likesService.create(createLikeDto);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(+id);
  }

  @Delete('post/:postId')
  remove(@Param('postId') postId: string, @Req() req: Request) {
    const user = req['user'];
    return this.likesService.removeByPostIdAndUserId(+postId, +user.id);
  }

  @Public()
  @Get('post/:postId')
  @ApiOperation({
    summary: 'Get all likes for a specific post',
    description: 'This endpoint returns all likes for a specific post',
  })
  @ApiParam({
    name: 'postId',
    type: Number,
    description: 'ID of the post',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of likes per page',
  })
  findByPostId(
    @Param('postId') postId: string,
    @Query() query: { page: number; limit: number },
  ) {
    const { page = 1, limit = 10 } = query;

    return this.likesService.findByPostId(+postId, { query: { page, limit } });
  }

  @Get('/hasLiked/:postId')
  @ApiOperation({
    summary: 'Check if a user has liked a specific post',
    description:
      'This endpoint returns true if the user has liked the specified post, false otherwise',
  })
  @ApiParam({
    name: 'postId',
    type: Number,
    description: 'ID of the post',
  })
  async hasUserLikedPost(
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<boolean> {
    const user = req['user'];
    const userId = user.id;
    return this.likesService.hasUserLikedPost(+postId, +userId);
  }
}
