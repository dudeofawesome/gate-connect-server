import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokens } from './user_tokens.entity';

@Injectable()
export class UserTokensService {
  constructor(
    @InjectRepository(UserTokens)
    private readonly user_tokensRepository: Repository<UserTokens>,
  ) {}

  findAll(): Promise<UserTokens[]> {
    return this.user_tokensRepository.find();
  }

  create(user_tokens: Partial<UserTokens>): Promise<UserTokens> {
    return this.user_tokensRepository.save<UserTokens>(this.user_tokensRepository.create(user_tokens));
  }
}
