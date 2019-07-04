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
    // Find whether a GateGroup b exists in array a
    function containsGateGroup(a: GateGroup[], b: GateGroup): boolean {
      for (const gate_group of a) {
        if (gate_group.uuid === b.uuid) {
          return true;
        }
      }
      return false;
    }

    // Find GateGroups and related Gates
    return this.userRepository
      .findOneOrFail({
        where: { uuid: user_uuid },
        relations: [
          'addresses',
          'addresses.gate_group_address',
          'addresses.gate_group_address.gate_group',
          'addresses.gate_group_address.gate_group.gates',
        ],
      })
      .then(user => {
        const gate_groups: GateGroup[] = [];
        user.addresses.forEach(user_address => {
          const gate_group = user_address.gate_group_address.gate_group;
          if (!containsGateGroup(gate_groups, gate_group)) {
            // if (!gate_groups.includes(gate_group)) { // this doesn't work
            gate_groups.push(gate_group);
          }
        });
        return gate_groups;
      });
  }
}
