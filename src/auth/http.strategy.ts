import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

import { AuthService } from './auth.service';
import { User } from '../user/';

@Injectable()
export class HttpStrategy extends PassportStrategy<typeof Strategy>(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<User> {
    try {
      return await this.authService.validateToken(token);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
