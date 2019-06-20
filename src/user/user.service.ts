import {
  Injectable,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './user.entity';
import { GateGroup } from 'src/gate-group';

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
    return this.userRepository.findOneOrFail({
      where: user,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { email },
    });
  }

  async findOneByUUID(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid },
    });
  }

  async patch(uuid: string, user: Partial<User>): Promise<User> {
    // TODO: verify the changes are valid

    // TODO: eslint-disable findOneOrFail(string)
    // const curr_user = await this.userRepository.findOneOrFail({
    //   where: { uuid },
    // });
    await this.userRepository.update(uuid, user);
    // TODO: return the actual user object
    return user as User;
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
