import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DEFAULT_LANG } from '../lang';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 150, nullable: true })
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

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;

  @Column({ name: 'phone', type: 'varchar', length: 100, default: '' })
  phone: string;

  @BeforeInsert()
  async checkData() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
