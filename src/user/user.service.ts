import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GateGroup } from '../gate-group/gate-group.entity';
import { Gate } from '../gate/gate.entity';

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

  async patch(uuid: string, user: Partial<User>): Promise<void> {
    await this.userRepository.update(uuid, user);
  }

  // TODO: Shouldn't this be findByUserUUID and belong in GateGroupsService?
  async getGateGroups(user_uuid: string): Promise<GateGroup[]> {
    return (
      this.userRepository
        .findOneOrFail({
          where: { uuid: user_uuid },
          relations: ['gate_groups', 'gate_groups.gates'],
        })
        // .then(user => user.gate_groups);
        .then(user => {
          const gate_groups: GateGroup[] = [];
          user.user_addresses.forEach(user_address => {
            gate_groups.push(user_address.gate_group_address.gate_group);
          });
          return gate_groups;
        })
    );
  }

  // TODO: will this work? (test it)
  async getGates(user: User): Promise<Gate[]> {
    const gates: Gate[] = [];
    await user.user_addresses.forEach(user_address => {
      gates.concat(user_address.gate_group_address.gate_group.gates);
    });
    return gates;
  }
}
