import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UseGuards,
  Logger,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { AuthService } from './auth.service';
import { User, UserService } from '../user/';
import { AuthGuard } from '@nestjs/passport';
import { UserToken, UserTokenService } from '../user-token';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    // private readonly authService: AuthService,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}

  @Post('login')
  // TODO: disallow authed requests
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() authInfo: AuthInfo): Promise<UserToken> {
    Logger.log(authInfo);
    try {
      const user = await this.userService.findOne({ email: authInfo.email });
      if (user.password === authInfo.password) {
        return await this.userTokenService.createTokenForUser(user);
      } else {
        throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
      }
    } catch (ex) {
      switch (ex.constructor) {
        case EntityNotFoundError:
          throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
        default:
          throw new HttpException(
            'Unknown error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }
}

export interface AuthInfo {
  email: string;
  password: string;
}
