import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, UserService } from '../user/';
import { JwtPayload } from './jwt-payload.interface';
import { UserTokenService } from '../user-token/';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}

  signIn(user: User): Promise<string> {
    const payload: Partial<JwtPayload> = { sub: user.uuid };
    return this.jwtService.signAsync(payload);
  }

  async validateJWT(payload: JwtPayload): Promise<User> {
    if (payload.exp * 1000 <= Date.now()) {
      throw new UnauthorizedException('Token expired');
    }

    const token = await this.userTokenService.findOneByToken(payload);
    if (token.blacklisted) {
      throw new UnauthorizedException('Token blacklisted');
    }

    return this.userService.findOneByUUID(payload.sub);
  }
}
