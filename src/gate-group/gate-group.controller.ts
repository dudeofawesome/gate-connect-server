import { Controller, Get, Post, Body } from '@nestjs/common';
import { GateGroupService } from './gate-group.service';
import { GateGroup } from './gate-group.entity';

@Controller('gate-groups')
export class GateGroupController {
  constructor(private readonly GateGroupService: GateGroupService) {}

  @Get()
  findAll(): Promise<GateGroup[]> {
    return this.GateGroupService.findAll();
  }

  @Post()
  create(@Body() body: Partial<GateGroup>): Promise<GateGroup> {
    return this.GateGroupService.create(body);
  }
}
