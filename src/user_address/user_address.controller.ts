import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UseGuards,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAddressService } from './user_address.service';
import { UserAddressInfoGuard } from '../utils/guards/user-address-info.guard';

@Controller('user_addresses')
export class UserAddressController {
  constructor(private readonly user_address_service: UserAddressService) {}
  @UseGuards(AuthGuard(), UserAddressInfoGuard) // TODO: Create UserAddressInfoGuard to make sure user can't change write only information
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
