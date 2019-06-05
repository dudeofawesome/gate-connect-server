import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { Login } from './login.entity';

@Controller('logins')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  findAll(): Promise<Login[]> {
    return this.loginService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Login>): Promise<Login> {
    return this.loginService.create(body);
  }
}
