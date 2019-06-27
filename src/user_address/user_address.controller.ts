import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
  HttpCode,
  Logger,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserAccess } from '../utils/guards/user-access.guard';
import { UserAddress } from '../user_address/user_address.entity';
import { UserAddressService } from './user_address.service';
import { UserParam } from '../utils/decorators/user.param.decorator';
import { User } from '../user/user.entity';
import { UserAddressInfoGuard } from '../utils/guards/user-address-info.guard';

@Controller('user_addresses')
export class UserAddressController {
  constructor(private readonly user_address_service: UserAddressService) {}

  /** GET all of the user addresses belonging to :user_uuid */
  @Get(':user_uuid')
  // Verify user is logged in, Verify user_uuid matches logged in user's auth token
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  findByUserUUID(
    @Param('user_uuid') user_uuid: string,
  ): Promise<UserAddress[]> {
    try {
      return this.user_address_service.findByUserUUID(user_uuid);
    } catch (ex) {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    }
  }

  /** Create a new user address */
  @Post()
  // Verify user is logged in, Verify user cannot change read only columns
  @UseGuards(AuthGuard(), UserAddressInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() user_address: Partial<UserAddress>,
    @UserParam() user: User,
  ): Promise<UserAddress> {
    return this.user_address_service
      .create({ ...user_address, user })
      .catch(ex => {
        Logger.error(ex);
        throw new InternalServerErrorException('Unknown error');
      });
  }

  /** Delete user address */
  @Delete(':user_address_uuid')
  // Verify user is logged in
  @UseGuards(AuthGuard())
  async delete(@Param('user_address_uuid') uuid: string): Promise<void> {
    await this.user_address_service.deleteUserAddress(uuid);
  }

  /** Verify address code */
  @Post(':user_address_uuid/verify-address')
  @HttpCode(200)
  @UseGuards(AuthGuard(), UserAddressInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyUserAddress(
    @Param('user_address_uuid') user_address_uuid: string,
    @Body() address_verification_pin: string,
  ): Promise<void> {
    // Get user address
    const user_address = await this.user_address_service.findByUUID(
      user_address_uuid,
    );
    // Verify that user provided pin and pin in database match
    if (user_address.verification_pin !== address_verification_pin) {
      throw new UnauthorizedException('Invalid address verification pin');
    }
    // If we didn't throw anything, mark address as verified
    await this.user_address_service.patch(user_address_uuid, {
      verified: true,
    });
  }
}
