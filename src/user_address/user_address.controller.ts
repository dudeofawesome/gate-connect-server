import {
  Controller,
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

import { UserAddress } from '../user_address/user_address.entity';
import { UserAddressService } from './user_address.service';
import { UserParam } from '../utils/decorators/user.param.decorator';
import { User } from '../user/user.entity';
import { UserAddressInfoGuard } from '../utils/guards/user-address-info.guard';

@Controller('user_addresses')
export class UserAddressController {
  constructor(private readonly user_address_service: UserAddressService) {}
  @UseGuards(AuthGuard(), UserAddressInfoGuard) // TODO: Create UserAddressInfoGuard to make sure user can't change write only information

  /** Create a new user address */
  @Post()
  @UseGuards(AuthGuard(), UserAddressInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() user_address: UserAddress,
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
    @Param('user_address_uuid') uuid: string,
    @Body() address_verification_pin: string,
  ): Promise<void> {
    // Get user address
    const user_address = await this.user_address_service.findByUUID(uuid);
    // Verify that user provided pin and pin in database match
    if (user_address.verification_pin !== address_verification_pin) {
      throw new UnauthorizedException('Invalid address verification pin');
    }
    // If we didn't throw anything, mark address as verified
    await this.user_address_service.patch(uuid, {
      verified: true,
    });
  }
}
