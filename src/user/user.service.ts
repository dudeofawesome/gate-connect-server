import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GateGroup } from '../gate-group';
import { UserEmail } from '../user_email/user_email.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly user_email_repository: Repository<UserEmail>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save<User>(this.userRepository.create(user));
  }

  async findOne(user: Partial<User>): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: user,
    });
  }

  /** Return User belonging to email */
  async findByEmail(email: string): Promise<User> {
    // Get a UserEmail from the user_email table by email
    const user_email = await this.user_email_repository.findOneOrFail({
      where: email,
    });
    return this.findOne(user_email.user);
  }

  async findOneByUUID(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid },
    });
  }

  async patch(uuid: string, user: Partial<User>): Promise<void> {
    await this.userRepository.update(uuid, user);
  }

  async getGateGroups(uuid: string): Promise<GateGroup[]> {
    return this.userRepository
      .findOneOrFail({
        where: { uuid },
        relations: ['gate_groups', 'gate_groups.gates'],
      })
      .then(user => user.gate_groups);
  }
}
