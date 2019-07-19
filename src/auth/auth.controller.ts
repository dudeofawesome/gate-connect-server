import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Logger,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  Req,
  Headers,
  Delete,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'argon2';
import { RandomString } from 'secure-random-value';

import { UserService } from '../user/user.service';
import { UserTokenService } from '../user-token/user-token.service';
import { UserToken } from '../user-token/user-token.entity';
import { NoAuthGuard } from '../utils/guards/no-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}

  @Post('login')
  @UseGuards(NoAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() authInfo: AuthInfo): Promise<UserToken> {
    const user = await this.userService
      .findByEmail(authInfo.email)
      .catch(ex => {
        if (ex instanceof EntityNotFoundError) {
          throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
        } else {
          // TODO: Logger logs empty object
          // Logger.error(ex);
          console.log(ex);
          throw new HttpException(
            'Unknown error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    if (await verify(user.password, authInfo.password)) {
      const token = await RandomString(64);
      const user_token = await this.userTokenService.saveToken(token, user);
      return user_token;
    } else {
      Logger.error(
        `Failed attempt to login user ${user.uuid}. Incorrect password`,
      );
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete('logout')
  @UseGuards(AuthGuard())
  async logout(@Headers('authorization') auth: string): Promise<boolean> {
    await this.userTokenService.deleteToken(auth.split('Bearer ')[1]);
    return true;
  }
}

export interface AuthInfo {
  email: string;
  password: string;
}
