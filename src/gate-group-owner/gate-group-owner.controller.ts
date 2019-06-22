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

import { GateGroupOwnerService, GateGroupOwner } from './';

@Controller('gate-group-owners')
export class GateGroupOwnerController {
  constructor(
    @Inject(forwardRef(() => GateGroupOwnerService))
    private readonly gateGroupOwnerService: GateGroupOwnerService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<GateGroupOwner[]> {
    return this.gateGroupOwnerService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() body: Partial<GateGroupOwner>): Promise<GateGroupOwner> {
    return this.gateGroupOwnerService.create(body).catch(err => {
      if (err instanceof QueryFailedError) {
        throw new InternalServerErrorException();
      } else {
        throw new InternalServerErrorException();
      }
    });
  }

  @Get(':gate_group_owner_uuid')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(
    @Param('gate_group_owner_uuid') uuid: string,
  ): Promise<GateGroupOwner> {
    try {
      return await this.gateGroupOwnerService.findOneByUUID(uuid);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Post(':gate_group_owner_uuid/gate-groups')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  createGateGroup(
    @Param('gate_group_owner_uuid') uuid: string,
    @Body() body: Partial<GateGroupOwner>,
  ): Promise<GateGroupOwner> {
    return this.gateGroupOwnerService.create(body).catch(err => {
      if (err instanceof QueryFailedError) {
        throw new InternalServerErrorException();
      } else {
        throw new InternalServerErrorException();
      }
    });
  }
}
