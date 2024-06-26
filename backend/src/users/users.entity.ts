import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  AfterLoad,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  // OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DEFAULT_LANG } from '../lang';
import { PostEntity } from '../posts/entities/post.entity';
import { Like } from '../posts/likes/entities/like.entity';
import { FollowEntity } from './follows/entities/follow.entity';
import { PostCommentEntity } from '../posts/comments/entities/comment.entity';
import { MessageEntity } from '../messages/entities/message.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
  username: string;

  // @Column({ name: 'full_name', type: 'varchar', length: 100 })
  // fullName: string;
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string;

  fullName: string;
  @AfterLoad()
  async setFullName() {
    if (this.firstName && this.lastName) {
      this.fullName = `${this.firstName} ${this.lastName}`;
    } else {
      this.fullName = this.firstName || this.lastName;
    }
  }

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  password: string;

  @Column({ name: 'is_password_reset', type: 'boolean', default: false })
  isPasswordReset: boolean;

  @Column({ name: 'signature', type: 'varchar', length: 255, nullable: true })
  signature: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'role', type: 'varchar', length: 50, default: 'user' })
  role: string;

  @Column({
    name: 'preferred_language',
    type: 'varchar',
    nullable: false,
    default: DEFAULT_LANG,
  })
  preferredLanguage: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    default: null,
  })
  deletedAt: Date;

  @Column({ name: 'phone', type: 'varchar', length: 100, default: '' })
  phone: string;

  @Column({
    name: 'profile_image_key',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profileImageKey: string;

  profileImageUrl: string;

  @BeforeInsert()
  async checkData() {
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // relations
  @OneToMany('Like', (like: Like) => like.user)
  @JoinColumn({ name: 'id' })
  likes: Like[];

  @OneToMany('PostEntity', (post: PostEntity) => post.user)
  @JoinColumn({ name: 'id' })
  posts: PostEntity[];

  @OneToMany('FollowEntity', (follow: FollowEntity) => follow.follower)
  @JoinColumn({ name: 'id' })
  following: FollowEntity[];

  @OneToMany('FollowEntity', (follow: FollowEntity) => follow.following)
  @JoinColumn({ name: 'id' })
  followers: FollowEntity[];

  @OneToMany('PostCommentEntity', (comment: PostCommentEntity) => comment.user)
  @JoinColumn({ name: 'id' })
  comments: PostCommentEntity[];

  @OneToMany('MessageEntity', (message: MessageEntity) => message.sender)
  @JoinColumn({ name: 'id' })
  sentMessages: MessageEntity[];

  @OneToMany('MessageEntity', (message: MessageEntity) => message.receiver)
  @JoinColumn({ name: 'id' })
  receivedMessages: MessageEntity[];
}
