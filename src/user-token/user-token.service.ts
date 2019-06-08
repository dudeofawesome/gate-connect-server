import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserToken } from './user-token.entity';
import { User } from '../user/';
import { AuthService } from '../auth';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  findAll(): Promise<UserToken[]> {
    return this.userTokenRepository.find();
  }

  createTokenForUser(user: User): Promise<UserToken> {
    return this.userTokenRepository.save(
      this.userTokenRepository.create({
        user: { id: user.id },
        authorization_token: this.authService.signIn(user),
      }),
    );
  }
}
