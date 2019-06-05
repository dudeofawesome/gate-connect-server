import { Controller, Get, Post, Body } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from './request.entity';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  findAll(): Promise<Request[]> {
    return this.requestService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Request>): Promise<Request> {
    return this.requestService.create(body);
  }
}
