import { Controller, Get, Post, Body } from '@nestjs/common';
import { GateService } from './gate.service';
import { Gate } from './gate.entity';

@Controller('gates')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Get()
  findAll(): Promise<Gate[]> {
    return this.gateService.findAll();
  }

  @Post()
  create(@Body() body: Partial<Gate>): Promise<Gate> {
    return this.gateService.create(body);
  }
}
