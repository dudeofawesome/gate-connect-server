import { Injectable, Logger } from '@nestjs/common';
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

  findAll(): Promise<UserToken[]> {
    return this.userTokenRepository.find();
  }

  createTokenForUserId(id: number): Promise<UserToken> {
    // Logger.log(id);
    // const token = new UserToken();
    // token.authorization_token = 'test2';
    return this.userTokenRepository.save(
      this.userTokenRepository.create({
        user: { id },
        authorization_token: Math.floor(Math.random() * 9999999) + '',
      }),
      // token,
    );
  }
}
