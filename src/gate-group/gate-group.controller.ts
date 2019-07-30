import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryFailedError } from 'typeorm';

import { GateGroup } from './gate-group.entity';
import { GateGroupService } from './gate-group.service';
import { Gate } from '../gate/gate.entity';

@Controller('gate-groups')
export class GateGroupController {
  constructor(
    @Inject(forwardRef(() => GateGroupService))
    private readonly gateGroupService: GateGroupService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<GateGroup[]> {
    return this.gateGroupService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() body: Partial<GateGroup>): Promise<GateGroup> {
    return this.gateGroupService.create(body);
  }

  @Get(':gate_group_uuid')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(
    @Param('gate_group_uuid') uuid: string,
  ): Promise<GateGroup> {
    try {
      return await this.gateGroupService.findOneByUUID(uuid);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get(':gate_group_uuid/gates')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getGates(@Param('gate_group_uuid') uuid: string): Promise<Gate[]> {
    return this.gateGroupService
      .findOneByUUID(uuid, true)
      .then(group => group.gates);
  }
}
