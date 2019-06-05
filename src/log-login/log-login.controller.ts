import { Controller, Get, Post, Body } from '@nestjs/common';
import { LogLoginService } from './log-login.service';
import { LogLogin } from './log-login.entity';

@Controller('log-logins')
export class LogLoginController {
  constructor(private readonly LogLoginService: LogLoginService) {}

  @Get()
  findAll(): Promise<LogLogin[]> {
    return this.LogLoginService.findAll();
  }

  @Post()
  create(@Body() body: Partial<LogLogin>): Promise<LogLogin> {
    return this.LogLoginService.create(body);
  }
}
