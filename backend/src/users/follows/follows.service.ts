import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Repository } from 'typeorm';
import { FollowEntity } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileStorageService } from '../../file-storage/file-storage.service';

@Injectable({})
export class FollowsService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followsRepository: Repository<FollowEntity>,
    private fileStorageService: FileStorageService,
  ) {}

  follow(followedId: number, followerId: number) {
    if (followedId === followerId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const data = {
      followerId: followerId,
      followingId: followedId,
    };

    const follow = this.followsRepository.create(data);
    return this.followsRepository.save(follow);
  }

  unfollow(followedId: number, followerId: number) {
    return this.followsRepository.delete({
      followingId: followedId,
      followerId: followerId,
    });
  }

  /**
   * Get the users that a user is following.
   * @param userId
   * @returns
   */
  async getUserFollowing(userId: number) {
    const subQuery = this.followsRepository
      .createQueryBuilder('f2')
      .select('COUNT(*)')
      .where('f2.followingId = f.followerId')
      .andWhere('f2.followerId = f.followingId');

    const query = this.followsRepository
      .createQueryBuilder('f')
      .select(['f.followerId'])
      .addSelect(`(${subQuery.getQuery()})`, 'areFriends')
      .leftJoin('f.following', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.profileImageKey',
        'user.firstName',
      ])
      .where('f.followerId = :userId', { userId });
    const result = await query.getRawMany();
    const mappedResultPromise = result.map(async (item) => {
      const profileImagekey = item.user_profile_image_key;
      let profileImageUrl = null;
      if (profileImagekey) {
        profileImageUrl =
          await this.fileStorageService.getSignedUrl(profileImagekey);
      }
      return {
        id: +item.user_id,
        username: item.user_username,
        email: item.user_email,
        areFriends: +item.areFriends > 0,
        profileImageUrl,
        firstName: item.user_first_name,
      };
    });
    const mappedResult = await Promise.all(mappedResultPromise);
    return mappedResult;
  }

  /**
   * Get the followers of a user.
   * @param userId
   * @returns
   */
  async getUserFollowers(userId: number) {
    const subQuery = this.followsRepository
      .createQueryBuilder('f2')
      .select('COUNT(*)')
      .where('f2.followingId = f.followerId')
      .andWhere('f2.followerId = f.followingId');

    const query = this.followsRepository
      .createQueryBuilder('f')
      .select(['f.followerId'])
      .addSelect(`(${subQuery.getQuery()})`, 'areFriends')
      .leftJoin('f.follower', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.profileImageKey',
        'user.firstName',
      ])
      .where('f.followingId = :userId', { userId });
    const result = await query.getRawMany();
    const mappedResultPromise = result.map(async (item) => {
      const profileImagekey = item.user_profile_image_key;
      let profileImageUrl = null;
      if (profileImagekey) {
        profileImageUrl =
          await this.fileStorageService.getSignedUrl(profileImagekey);
      }
      return {
        id: +item.user_id,
        username: item.user_username,
        email: item.user_email,
        areFriends: +item.areFriends > 0,
        profileImageUrl,
        firstName: item.user_first_name,
      };
    });
    const mappedResult = await Promise.all(mappedResultPromise);
    return mappedResult;
  }

  /**
   * Check if the logged-in user is following another user.
   * @param loggedInUserId
   * @param otherUserId
   * @returns
   */
  async isUserFollowing(
    loggedInUserId: number,
    otherUserId: number,
  ): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: { followerId: loggedInUserId, followingId: otherUserId },
    });

    return !!follow;
  }

  /**
   * Get the count of followers of a user.
   * @param userId
   * @returns
   */
  async getFollowersCount(userId: number): Promise<number> {
    return await this.followsRepository.count({
      where: {
        followingId: userId,
      },
    });
  }

  /**
   * Get the count of users a user is following.
   * @param userId
   * @returns
   */
  async getFollowingCount(userId: number): Promise<number> {
    return await this.followsRepository.count({
      where: {
        followerId: userId,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createFollowDto: CreateFollowDto) {
    return 'This action adds a new follow';
  }

  findAll() {
    return `This action returns all follows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
