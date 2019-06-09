import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/';

@Injectable()
export class JwtStrategy extends PassportStrategy<typeof Strategy>(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO: change the key!
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: JwtPayload, a: any, b: any, c: any): Promise<User> {
    try {
      return await this.authService.validateJWT(payload);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
