import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/users.entity';
import { Like } from '../likes/entities/like.entity';
import { PostCommentEntity } from '../comments/entities/comment.entity';

@Entity({
  name: 'posts',
})
export class PostEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

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

  @ManyToOne('UserEntity', (user: UserEntity) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany('Like', (like: Like) => like.post)
  @JoinColumn({ name: 'id' })
  likes: Like[];

  @OneToMany('PostCommentEntity', (comment: PostCommentEntity) => comment.post)
  @JoinColumn({ name: 'id' })
  comments: PostCommentEntity[];
}
