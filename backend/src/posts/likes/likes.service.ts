import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { DataSource, Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import StandardizedPaginateResult from '../../common/paginate/standarized.paginate.result';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private dataSource: DataSource,
  ) {}
  async create(createLikeDto: CreateLikeDto) {
    const { userId, postId } = createLikeDto;
    // const deleted = await this.likeRepository.delete({ userId, postId });
    // const like = this.likeRepository.create({ userId, postId });
    // const inserted = await this.likeRepository.save(like);
    // return { deleted, inserted };
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleted = await queryRunner.manager.delete(Like, {
        userId,
        postId,
      });
      const inserted = await queryRunner.manager.insert(Like, {
        userId,
        postId,
      });

      await queryRunner.commitTransaction();
      return { deleted, inserted };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.likeRepository.find();
  }

  findOne(id: number) {
    return this.likeRepository.findOne({
      where: { id },
    });
  }

  async removeByPostIdAndUserId(postId: number, userId: number) {
    // return this.likeRepository.delete({ postId, userId });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const deleted = await queryRunner.manager.delete(Like, {
        postId,
        userId,
      });
      await queryRunner.commitTransaction();
      return deleted;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.likeRepository.delete(id);
  }

  /**
   * Finds all likes for a specific post.
   * @param postId
   * @param param1
   * @returns
   */
  async findByPostId(
    postId: number,
    options: { query: { page: number; limit: number } } = {
      query: { page: 1, limit: 10 },
    },
  ) {
    const { page, limit } = options.query;
    const skip = (page - 1) * limit;
    const [likes, total] = await this.likeRepository
      .createQueryBuilder('like')
      .where('like.postId = :postId', { postId })
      .leftJoin('like.user', 'user')
      .select(['like', 'user.id', 'user.username'])
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return new StandardizedPaginateResult({
      page,
      limit,
      total,
      items: likes,
    });
  }

  /**
   * Checks if a user has liked a specific post.
   * @param postId
   * @param userId
   * @returns
   */
  async hasUserLikedPost(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });
    return !!like;
  }
}
