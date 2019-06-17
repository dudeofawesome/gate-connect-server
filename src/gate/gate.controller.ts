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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GateService, Gate } from './';
import { GateAccessGuard } from '../utils/guards';

@Controller('gates')
export class GateController {
  constructor(
    @Inject(forwardRef(() => GateService))
    private readonly gateService: GateService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<Gate[]> {
    return this.gateService.findAll();
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
