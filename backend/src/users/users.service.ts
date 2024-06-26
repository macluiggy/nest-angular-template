import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/users.dto';
import getMessages from '../lang/getMessages';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import Lang from '../lang/lang.type';

@Injectable({
  scope: Scope.REQUEST,
})
export class UsersService {
  private messages: Lang;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private readonly request: Request,
    private dataSource: DataSource,
  ) {
    const lang =
      this.request.headers['accept-language'] ||
      this.request['preferredLanguage'];
    this.messages = getMessages(lang);
  }

  async checkPassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }

  async create(user: UserDto): Promise<UserEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (await this.userAlreadyExists(user)) {
        throw new ConflictException(this.messages.USER.ALREADY_EXISTS);
      }
      const newUser = this.userRepository.create({
        ...user,
      });
      // return await this.userRepository.save(newUser);
      const data = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async userAlreadyExists({ email, username }: UserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    return !!user;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, userDto: UserDto): Promise<UserEntity> {
    delete userDto.password; // Don't update the password here
    const user = await this.findOne(id);
    const updatedUserData = {
      ...user,
      ...userDto,
    };
    const updatedUser = await this.userRepository.save(updatedUserData);
    delete updatedUser.password;

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail({
      where: { email },
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
      where: { email },
    });
    await this.userRepository.delete(user.id);
  }
}
