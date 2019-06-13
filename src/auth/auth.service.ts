import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { User, UserService } from '../user/';
import { UserTokenService, UserToken } from '../user-token/';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}

  async validateToken(token: string): Promise<User> {
    // Validate if token passed along with HTTP request
    // is associated with any registered account in the database
    // return await this.userService.findOneByToken(token);
    const user_token = await this.userTokenService
      .findOneByToken(token)
      .catch(err => {
        if (err instanceof EntityNotFoundError) {
          throw new UnauthorizedException('Token invalid');
        } else {
          throw err;
        }
      });

    // check if token is expired
    if (user_token.created_at.plus(user_token.ttl) < DateTime.local()) {
      // delete token from DB
      await this.userTokenService.deleteToken(user_token.authorization_token);

      // throw expired token error
      // TODO: figure out a more appropriate error type
      throw new UnauthorizedException('Token expired');
    } else {
      return user_token.user;
    }
  }
}
