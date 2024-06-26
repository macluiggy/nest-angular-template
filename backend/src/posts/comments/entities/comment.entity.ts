import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { UserEntity } from '../../../users/users.entity';

@Entity({
  name: 'post_comment',
})
export class PostCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'parent_comment_id', nullable: true })
  parentCommentId: number;

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

  // Relations
  @ManyToOne('UserEntity', (user: UserEntity) => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne('PostEntity', (post: PostEntity) => post.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => PostCommentEntity, (comment) => comment.childComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: PostCommentEntity;

  @OneToMany(() => PostCommentEntity, (comment) => comment.parentComment)
  @JoinColumn({ name: 'parent_comment_id' })
  childComments: PostCommentEntity[];
}
