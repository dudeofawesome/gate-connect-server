import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserTokensService } from './user_tokens.service';
import { UserTokens } from './user_tokens.entity';

@Controller('user_tokens')
export class UserTokensController {
  constructor(private readonly user_tokensService: UserTokensService) {}

  @Get()
  findAll(): Promise<UserTokens[]> {
    return this.user_tokensService.findAll();
  }

  @Post()
  create(@Body() body: Partial<UserTokens>): Promise<UserTokens> {
    return this.user_tokensService.create(body);
  }
}
