import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import getMessages from '../lang/getMessages';
import Lang from '../lang/lang.type';
import paginate from '../common/paginate/paginate';
import StandardizedPaginateResult from '../common/paginate/standarized.paginate.result';
// import wait from '../common/utils/wait';

@Injectable({
  scope: Scope.REQUEST,
})
export class PostsService {
  private messages: Lang;
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @Inject('REQUEST') private readonly request: Request,
  ) {
    const lang = this.request['preferredLanguage'];
    this.messages = getMessages(lang);
  }
  async create(createPostDto: CreatePostDto) {
    return await this.postsRepository.save(createPostDto);
  }

  async findAll() {
    return await this.postsRepository.find();
  }

  async findOne(id: number) {
    const query = this.postsRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.user', 'user');

    const post = await query.getOne();
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await this.postsRepository.delete(id);
  }

  /**
   * Finds posts belonging to a specific user.
   *
   * @param options - The options for pagination and filtering.
   * @param options.userId - The ID of the user.
   * @param options.page - The page number for pagination.
   * @param options.limit - The maximum number of posts per page.
   * @returns - A promise that resolves to the paginated posts.
   */
  async findUserPosts({ userId }, { page, limit }) {
    return paginate(
      this.postsRepository,
      { page, limit },
      { where: { userId } },
    );
  }

  /**
   * Finds random posts along with the user who created each post.
   *
   * @param options - The options for pagination.
   * @param options.page - The page number for pagination.
   * @param options.limit - The maximum number of posts per page.
   * @returns - A promise that resolves to the paginated posts.
   */
  async findRandomPosts({ page, limit }) {
    // for testing return with a persistend order
    // const postsTest = await this.postsRepository.find({
    //   take: limit,
    //   skip: (page - 1) * limit,
    //   order: { id: 'ASC' },
    // });
    // return {
    //   items: postsTest,
    //   total: postsTest.length,
    //   page,
    //   limit,
    // };
    // await wait(2000);
    const skip = (page - 1) * limit;
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .addSelect(['user.username', 'user.firstName', 'user.id'])
      .addSelect('RANDOM()', 'random_value') // Alias the RANDOM() function
      .orderBy('random_value', 'ASC') // Use the alias in the orderBy clause
      .addOrderBy('post.id', 'ASC')
      .skip(skip)
      .take(limit);

    const posts = await query.getMany();

    const total = await query.getCount();

    return new StandardizedPaginateResult({
      items: posts,
      total,
      page,
      limit,
    });
  }
}
