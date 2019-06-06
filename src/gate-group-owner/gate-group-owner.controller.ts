import { Controller, Get, Post, Body } from '@nestjs/common';
import { GateGroupOwnerService } from './gate-group-owner.service';
import { GateGroupOwner } from './gate-group-owner.entity';

@Controller('gate-group-owners')
export class GateGroupOwnerController {
  constructor(private readonly GateGroupOwnerService: GateGroupOwnerService) {}

  @Get()
  findAll(): Promise<GateGroupOwner[]> {
    return this.GateGroupOwnerService.findAll();
  }

  @Post()
  create(@Body() body: Partial<GateGroupOwner>): Promise<GateGroupOwner> {
    return this.GateGroupOwnerService.create(body);
  }
}
