import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserToken } from './user-token.entity';
import { User } from '../user/';
import { AuthService, JwtPayload } from '../auth';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
  ) {}

  findOneByToken(payload: JwtPayload): Promise<UserToken> {
    return this.userTokenRepository.findOneOrFail({
      where: {
        token_payload_sub: payload.sub,
        token_payload_iat: new Date((payload.iat || 0) * 1000),
      },
    });
  }

  async saveToken(jwt: string): Promise<UserToken> {
    // TODO: remove the `as any`
    const payload: Readonly<JwtPayload> = this.jwtService.decode(jwt) as any;
    return await this.userTokenRepository.save(
      this.userTokenRepository.create({
        /**
         * TODO: make the user link actually work. changing to
         * `uuid: payload.sub` breaks token creation
         */
        user: { id: 1 },
        token_payload_sub: payload.sub,
        token_payload_iat: new Date((payload.iat || 0) * 1000),
      }),
    );
  }
}
