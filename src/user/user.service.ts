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
    if (user.uuid != null && user.uuid !== uuid) {
      // TODO: see if there's a better exception to throw here
      throw new ForbiddenException('Cannot change user.uuid');
    } else if (user.password != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.password in a full user patch',
      );
    } else if (user.created_at != null) {
      throw new UnprocessableEntityException('Cannot change user.created_at');
    } else if (user.updated_at != null) {
      throw new UnprocessableEntityException('Cannot change user.updated_at');
    } else if (user.verified_email != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.verified_email',
      );
    } else if (user.verified_address != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.verified_address',
      );
    } else if (user.verification_email_token != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.verification_email_token',
      );
    } else if (user.verification_address_pin != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.verification_address_pin',
      );
    } else if (user.verification_email_sent_at != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.verification_email_sent_at',
      );
    } else if (user.verification_address_sent_at != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.verification_address_sent_at',
      );
    }

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
