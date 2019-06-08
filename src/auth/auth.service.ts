import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, UserService } from '../user/';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
  ) {}

  signIn(user: User): string {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials
    return this.jwtService.sign({ uuid: user.uuid });
  }

  validateJWT(payload: JwtPayload): Promise<User> {
    return this.userService.findOneByUUID(payload.uuid);
  }
}
