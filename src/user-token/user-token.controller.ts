import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserTokenService } from './user-token.service';
import { UserToken } from './user-token.entity';

@Controller('user-token')
export class UserTokenController {
  constructor(private readonly UserTokenService: UserTokenService) {}

  @Get()
  findAll(): Promise<UserToken[]> {
    return this.UserTokenService.findAll();
  }
}
