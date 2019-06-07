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
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { User, UserService } from '../user/';
import { AuthGuard } from '@nestjs/passport';
import { UserToken, UserTokenService } from '../user-token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly userTokenService: UserTokenService,
  ) {}

  @Post('login')
  // TODO: disallow authed requests
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() authInfo: AuthInfo): Promise<UserToken> {
    Logger.log(authInfo);
    const user = await this.userService.findOne(authInfo);
    return await this.userTokenService.createTokenForUserId(user.id);
  }
}

export interface AuthInfo {
  email: string;
  password: string;
}
