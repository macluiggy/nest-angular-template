import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { SeederEntity } from '../seeders.entity';
import { UserEntity } from '../../users/users.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { FollowEntity } from '../../users/follows/entities/follow.entity';
import { Like } from '../../posts/likes/entities/like.entity';
import { PostCommentEntity } from '../../posts/comments/entities/comment.entity';
import { DEFAULT_LANG } from '../../lang';
import {
  EMAIL_FOR_TESTING,
  FULL_NAME_FOR_TESTING,
  PASSWORD_FOR_TESTING,
  USERNAME_FOR_TESTING,
} from '../../auth/utils/singInUser';
import * as bcrypt from 'bcrypt';

export class PopulizeTables1716408463154 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const seederRepository = dataSource.getRepository(SeederEntity);
    const seederName = 'PopulizeTables1716408463154';

    const seeder = await seederRepository.findOne({
      where: { name: seederName },
    });

    // if (seeder) {
    //   console.log(`Seeder "${seederName}" already executed. Skipping...`);
    //   return;
    // }

    // repositories
    const usersRepository = dataSource.getRepository(UserEntity);
    const followsRepository = dataSource.getRepository(FollowEntity);
    const likesRepository = dataSource.getRepository(Like);
    const postCommentRepository = dataSource.getRepository(PostCommentEntity);
    const postsRepository = dataSource.getRepository(PostEntity);

    const userQueryBuilder = usersRepository.createQueryBuilder();
    // delete all users that have the email starting with 'dummy.'
    await userQueryBuilder
      .delete()
      .where('email like :email', { email: 'dummy.%' })
      .execute();

    // factories
    const userFactory = factoryManager.get(UserEntity);
    const postsFactory = factoryManager.get(PostEntity);
    const postCommentFactory = factoryManager.get(PostCommentEntity);

    // seed default users
    await this.seedDefaultUsers({ userRepository: usersRepository });
    const usersSaved = await this.seedUsersTable({ userFactory });
    const postsSaved = await this.seedPostsTable({
      postsFactory,
      postsRepository,
      users: usersSaved,
    });

    await this.seedLikesTable({
      posts: postsSaved,
      users: usersSaved,
      likeRepository: likesRepository,
    });

    await this.seedFollowsTable({
      users: usersSaved,
      followRepository: followsRepository,
    });

    await this.seedPostCommentsTable({
      posts: postsSaved,
      users: usersSaved,
      postCommentRepository,
      postCommentFactory,
    });

    if (seeder) {
      seeder.executed = true;
    } else {
      await seederRepository.insert({
        name: seederName,
        executed: true,
      });
    }

    console.log('PopulizeTables1716408463154 seeder executed');
  }

  async seedDefaultUsers({
    userRepository,
  }: {
    userRepository: Repository<UserEntity>;
  }) {
    const users = [
      {
        firstName: 'luiggy',
        lastName: 'ferrin',
        email: 'ferrinluiggy@gmail.com',
        password: await bcrypt.hash('123456', 10),
        phone: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'macluiggy',
        preferredLanguage: DEFAULT_LANG,
      },
      {
        firstName: FULL_NAME_FOR_TESTING,
        lastName: 'ferrin',
        email: EMAIL_FOR_TESTING,
        password: await bcrypt.hash(PASSWORD_FOR_TESTING, 10),
        phone: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: USERNAME_FOR_TESTING,
        preferredLanguage: DEFAULT_LANG,
      },
    ];

    for (const user of users) {
      const existingUser = await userRepository.findOne({
        where: [{ email: user.email }, { username: user.username }],
      });

      if (!existingUser) {
        await userRepository.insert(user);
      }
    }
  }

  async seedUsersTable({
    userFactory,
  }: {
    userFactory: SeederFactory<UserEntity, unknown>;
  }) {
    const usersSaved = await userFactory.saveMany(10);
    return usersSaved;
  }

  async seedPostsTable({
    postsFactory,
    users,
    postsRepository,
  }: {
    postsFactory: SeederFactory<PostEntity, unknown>;
    users: UserEntity[];
    postsRepository: Repository<PostEntity>;
  }) {
    const posts = [];
    for (const user of users) {
      for (let i = 0; i < 2; i++) {
        const post = await postsFactory.make({ user });
        posts.push(post);
      }
    }

    const postsSaved = postsRepository.create(posts);
    await postsRepository.save(postsSaved);
    return postsSaved;
  }

  async seedFollowsTable({
    users,
    followRepository,
  }: {
    users: UserEntity[];
    followRepository: Repository<FollowEntity>;
  }) {
    const follows = [];

    for (const user of users) {
      for (const otherUser of users) {
        if (user.id !== otherUser.id) {
          follows.push({
            following: user,
            follower: otherUser,
          });
        }
      }
    }

    await followRepository
      .createQueryBuilder()
      .insert()
      .into(FollowEntity)
      .values(follows)
      .execute();
  }

  async seedLikesTable({
    posts,
    users,
    likeRepository,
  }: {
    posts: PostEntity[];
    users: UserEntity[];
    likeRepository: Repository<Like>;
  }) {
    const likes = [];

    for (const post of posts) {
      for (const user of users) {
        likes.push({
          post,
          user,
        });
      }
    }

    await likeRepository
      .createQueryBuilder()
      .insert()
      .into(Like)
      .values(likes)
      .execute();
  }

  async seedPostCommentsTable({
    posts,
    users,
    postCommentRepository,
    postCommentFactory,
  }: {
    posts: PostEntity[];
    users: UserEntity[];
    postCommentRepository: Repository<PostCommentEntity>;
    postCommentFactory: SeederFactory<PostCommentEntity, unknown>;
  }) {
    const comments = [];

    for (const post of posts) {
      for (const user of users) {
        const comment = await postCommentFactory.make({
          post,
          user,
        });
        comments.push(comment);
      }
    }

    const postComments = postCommentRepository.create(comments);
    await postCommentRepository.save(postComments);

    // add replies to the created comments
    const replies = [];
    for (const comment of postComments) {
      // add two replies to each comment
      for (let i = 0; i < 2; i++) {
        const reply = await postCommentFactory.make({
          post: comment.post,
          user: users[Math.floor(Math.random() * users.length)],
          parentComment: comment,
        });
        replies.push(reply);
      }
    }

    const postCommentReplies = postCommentRepository.create(replies);
    await postCommentRepository.save(postCommentReplies);
  }
}
