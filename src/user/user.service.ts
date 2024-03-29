import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './user.entity';
import { GateGroup } from '../gate-group/gate-group.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

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
    // Use a raw SQL query to find user based on email
    // This is much faster than relying on typeorm.
    const user = await this.userRepository.query(
      `SELECT *
      FROM "user"
      WHERE uuid = (
        SELECT user_uuid
        FROM user_email
        WHERE email = '${email}')`,
    );
    if (user.length === 0) {
      // TODO: What criteria does this want for a parameter?
      throw new EntityNotFoundError(User, 'What criteria?');
    }
    return user[0];
  }

  /** Find one user or fail given uuid */
  async findOneByUUID(uuid: string, relations?: string[]): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid },
      relations,
    });
  }

  /** Update user's information based on uuid */
  async patch(uuid: string, user: DeepPartial<User>): Promise<void> {
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
        for (let user_address of user.addresses) {
          if (user_address.gate_group_address != null) {
            const gate_group = user_address.gate_group_address.gate_group;
            if (!containsGateGroup(gate_groups, gate_group)) {
              // if (!gate_groups.includes(gate_group)) { // this doesn't work
              gate_groups.push(gate_group);
            }
          }
        }
        return gate_groups;
      });
  }

  /** Delete user */
  async deleteUser(user_uuid: string): Promise<void> {
    this.userRepository.delete(user_uuid);
  }
}
