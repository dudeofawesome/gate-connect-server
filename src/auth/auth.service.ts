import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { User, UserService } from '../user/';
import { UserTokenService } from '../user-token/';

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
    const user = (await this.userTokenService.findOneByToken(token)).user;
    console.log('USER');
    console.log(user);
    return user;
  }
}
