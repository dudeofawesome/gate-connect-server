import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserToken } from './user-token.entity';
import { User } from '../user/';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  findOneByToken(token: string): Promise<UserToken> {
    return this.userTokenRepository.findOneOrFail({
      where: {
        authorization_token: token,
      },
    });
  }

  async saveToken(token: string, user: User): Promise<UserToken> {
    return await this.userTokenRepository.save(
      this.userTokenRepository.create({
        user: { id: user.id },
        authorization_token: token,
      }),
    );
  }

  async deleteToken(token: string): Promise<any> {
    await this.userTokenRepository.delete({
      authorization_token: token,
    });
  }
}
