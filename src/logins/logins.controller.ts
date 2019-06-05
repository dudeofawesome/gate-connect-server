import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoginsService } from './logins.service';
import { Logins } from './logins.entity';

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Get()
  findAll(): Promise<Logins[]> {
    return this.loginsService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Logins>): Promise<Logins> {
    return this.loginsService.create(body);
  }
}
