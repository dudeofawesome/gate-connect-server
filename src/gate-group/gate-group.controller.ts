import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { GateGroupService, GateGroup } from './';
import { AuthGuard } from '@nestjs/passport';
import { QueryFailedError } from 'typeorm';

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

  @Get(':uuid')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(@Param('uuid') uuid: string): Promise<GateGroup> {
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
}
