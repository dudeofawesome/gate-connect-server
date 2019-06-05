import { Controller, Get, Post, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests } from './requests.entity';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  findAll(): Promise<Requests[]> {
    return this.requestsService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Requests>): Promise<Requests> {
    return this.requestsService.create(body);
  }
}
