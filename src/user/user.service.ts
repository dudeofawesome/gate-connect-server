import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save<User>(this.userRepository.create(user));
  }

  async findOne(user: Partial<User>): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: user,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { email },
    });
  }

  async findOneByUUID(uuid: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { uuid },
    });
  }
}
