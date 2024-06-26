import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import getApiEndpoint from '../../common/utils/getApiEndpoint';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller({
  path: getApiEndpoint('post-comments'),
})
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }

  @Get('post/:postId')
  getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: { page: number; limit: number },
  ) {
    const { page = 1, limit = 10 } = query;
    return this.commentsService.getCommentsByPostId(+postId, { page, limit });
  }
}
