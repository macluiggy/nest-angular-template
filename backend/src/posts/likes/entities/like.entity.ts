import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/users.entity';
import { PostEntity } from '../../entities/post.entity';

@Entity('likes')
@Unique('UQ_USER_POST', ['userId', 'postId'])
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'int', name: 'post_id', nullable: false })
  postId: number;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    default: null,
  })
  deletedAt: Date | null;

  // relations
  @ManyToOne('UserEntity', (user: UserEntity) => user.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne('PostEntity', (post: PostEntity) => post.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
