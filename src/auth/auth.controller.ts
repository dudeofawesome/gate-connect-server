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
  Req,
  Headers,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User, UserService } from '../user/';
import { UserToken, UserTokenService } from '../user-token';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}

  @Post('login')
  // TODO: disallow authed requests
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() authInfo: AuthInfo): Promise<string> {
    Logger.log(authInfo);
    const user = await this.userService
      .findOne({ email: authInfo.email })
      .catch(ex => {
        if (ex instanceof EntityNotFoundError) {
          throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
        } else {
          Logger.error(ex);
          throw new HttpException(
            'Unknown error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    // TODO: hash + salt password
    if (user.password === authInfo.password) {
      const jwt = await this.authService.signIn(user);
      await this.userTokenService.saveToken(jwt);
      return jwt;
    } else {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async logout(
    @Req() req: Request,
    @Headers('Authorization') auth: string,
  ): Promise<boolean> {
    // TODO: blacklist token
    console.log(req.authInfo);
    console.log(req.user);
    console.log(auth);
    return true;
  }
}

export interface AuthInfo {
  email: string;
  password: string;
}
