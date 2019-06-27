import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GateGroup } from '../gate-group/gate-group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Return all users in the database */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /** Create user given partial user object */
  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save<User>(this.userRepository.create(user));
  }

  /** Find one or fail given user */
  async findOne(user: Partial<User>): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: user,
    });
  }

  /** Return User belonging to email */
  async findByEmail(email: string): Promise<User> {
    // Get a UserEmail from the user_email table by email
    return this.userRepository.findOneOrFail({
      where: {
        emails: [{ email }],
      },
    });
  }

  /** Find one user or fail given uuid */
  async findOneByUUID(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid },
    });
  }

  /** Update user's information based on uuid */
  async patch(uuid: string, user: Partial<User>): Promise<void> {
    await this.userRepository.update(uuid, user);
  }

  /** Return all the gate groups belonging to a user_uuid */
  async getGateGroups(user_uuid: string): Promise<GateGroup[]> {
    return this.userRepository
      .findOneOrFail({
        where: { uuid: user_uuid },
        relations: ['gate_groups', 'gate_groups.gates'],
      })
      .then(user => {
        const gate_groups: GateGroup[] = [];
        user.addresses.forEach(user_address => {
          gate_groups.push(user_address.gate_group_address.gate_group);
        });
        return gate_groups;
      });
  }
}
