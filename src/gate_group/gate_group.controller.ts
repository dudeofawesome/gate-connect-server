import { Controller, Get, Post, Body } from '@nestjs/common';
import { GateGroupService } from './gate_group.service';
import { GateGroup } from './gate_group.entity';

@Controller('gate_groups')
export class GateGroupController {
  constructor(private readonly gate_groupService: GateGroupService) {}

  @Get()
  findAll(): Promise<GateGroup[]> {
    return this.gate_groupService.findAll();
  }

  @Post()
  create(@Body() body: Partial<GateGroup>): Promise<GateGroup> {
    return this.gate_groupService.create(body);
  }
}
