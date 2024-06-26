import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import StandardizedPaginateResult from '../../common/paginate/standarized.paginate.result';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(PostCommentEntity)
    private postCommentRepository: Repository<PostCommentEntity>,
  ) {}

  async getCommentsByPostId(
    postId: number,
    options: { page: number; limit: number } = { page: 1, limit: 10 },
  ) {
    const { page, limit } = options;
    const take = +limit;
    const skip = (+page - 1) * take;
    const query = this.postCommentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.username'])
      // .leftJoin('comment.post', 'post')
      // .addSelect(['post.id', 'post.title'])
      .leftJoin('comment.parentComment', 'parentComment')
      .addSelect(['parentComment.id', 'parentComment.content'])
      .leftJoin('comment.childComments', 'childComments')
      .addSelect([
        'childComments.id',
        'childComments.content',
        'childComments.createdAt',
      ])
      .leftJoin('childComments.user', 'childUser') // join the user table for the childComments
      .addSelect(['childUser.id', 'childUser.username']) // select the user data for the childComments
      .where('comment.postId = :postId AND comment.parentCommentId IS NULL', {
        postId,
      })
      .orderBy('comment.createdAt', 'DESC')
      .take(take)
      .skip(skip);
    const total = await query.getCount();
    const data = await query.getMany();

    return new StandardizedPaginateResult({
      items: data,
      total,
      page: +page,
      limit: +limit,
    });
  }

  async create(createCommentDto: CreateCommentDto) {
    const created = this.postCommentRepository.create(createCommentDto);
    return this.postCommentRepository.save(created);
  }

  findAll() {
    // return this.postCommentRepository.find();
    const query = this.postCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.parentComment', 'parentComment')
      .leftJoinAndSelect('comment.childComments', 'childComments')
      .orderBy('comment.createdAt', 'DESC');

    return query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    const updated = this.postCommentRepository.create(updateCommentDto);
    return this.postCommentRepository.update(id, updated);
  }

  remove(id: number) {
    return this.postCommentRepository.delete(id);
  }
}
