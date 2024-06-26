import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../users.entity';

// typeorm entity
@Entity({
  name: 'follows',
})
@Unique('UQ_FOLLOWER_FOLLOWING', ['followerId', 'followingId'])
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'follower_id' })
  followerId: number;

  @Column({ name: 'following_id' })
  followingId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'following_id' })
  following: UserEntity;
}
