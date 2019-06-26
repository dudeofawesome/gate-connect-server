import {
  Controller,
} from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { UserAddressInfoGuard } from '../utils/guards/user-address-info.guard';

@Controller('user_addresses')
export class UserAddressController {
  constructor(private readonly user_address_service: UserAddressService) {}
  @UseGuards(AuthGuard(), UserAddressInfoGuard) // TODO: Create UserAddressInfoGuard to make sure user can't change write only information
  @UseGuards(AuthGuard(), UserAddressInfoGuard)
}
