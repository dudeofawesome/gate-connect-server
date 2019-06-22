import {
  Controller,
  Get,
  Inject,
  forwardRef,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserTokenService } from './user-token.service';
import { UserToken } from './user-token.entity';

@Controller('user-token')
export class UserTokenController {
  constructor(
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}

  @Get(':token')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async getToken(
    @Param('token') token: string,
  ): Promise<UserToken | undefined> {
    return this.userTokenService.findOneByToken(token, false);
  }
}
