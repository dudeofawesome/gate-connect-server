import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Inject,
  forwardRef,
  Param,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { GateService, Gate } from './';
import { GateAccessGuard } from '../utils/guards/gate-access.guard';
import { UserService, User } from '../user';

@Controller('gates')
export class GateController {
  constructor(
    @Inject(forwardRef(() => GateService))
    private readonly gateService: GateService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() req: Request): Promise<Gate[]> {
    // TODO: allow for super-admins to retrieve all gates
    const user: User = req.user;
    const gate_groups = await this.userService
      .getGateGroups(user.uuid)
      .then(groups => groups.map(group => group.gates));
    return ([] as Gate[]).concat(...gate_groups);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() body: Partial<Gate>): Promise<Gate> {
    return this.gateService.create(body);
  }

  @Post(':uuid/open')
  @UseGuards(AuthGuard(), GateAccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async openGate(@Param('uuid') uuid: string): Promise<boolean> {
    // TODO: actually open the gate
    return true;
  }
}
