import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './user-token.entity';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly UserTokenRepository: Repository<UserToken>,
  ) {}

  findAll(): Promise<UserToken[]> {
    return this.UserTokenRepository.find();
  }

  create(user-token: Partial<UserToken>): Promise<UserToken> {
    return this.UserTokenRepository.save<UserToken>(this.UserTokenRepository.create(user-token));
  }
}
