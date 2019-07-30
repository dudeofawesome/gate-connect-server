import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserToken } from './user-token.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  findOneByToken(
    token: string,
    include_user: boolean = true,
  ): Promise<UserToken> {
    return this.userTokenRepository.findOneOrFail({
      where: {
        authorization_token: token,
      },
      relations: include_user ? ['user'] : [],
    });
  }

  async saveToken(token: string, user: User): Promise<UserToken> {
    return await this.userTokenRepository.save(
      this.userTokenRepository.create({
        user: { uuid: user.uuid },
        authorization_token: token,
      }),
    );
  }

  async deleteToken(token: string): Promise<void> {
    await this.userTokenRepository.delete({
      authorization_token: token,
    });
  }
}
