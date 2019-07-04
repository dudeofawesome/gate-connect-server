import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserAddress } from '../../user_address/user_address.entity';
import { UserAddressService } from '../../user_address/user_address.service';

/** Verify that user has not attempted to change any read-only properties */
@Injectable()
export class UserAddressInfoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly user_address_service: UserAddressService,
  ) {}

  // TODO: This is ugly. Replace this with a decorator that we reflect on
  isUserEditable(key: string) {
    // This is how you might use the decorator in the todo below below
    // const user_editable = this.reflector.get<string[]>(
    //   'email_user_editable',
    //   context.getHandler(),
    // );
    // console.log(user_editable);
    const user_editable_columns = [
      'premise',
      'thoroughfare',
      'locality',
      'postal_code',
      'administrative_area',
    ];
    return user_editable_columns.includes(key);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    // TODO: bypass checks if user is admin

    let user_address: Partial<UserAddress> | undefined;
    if (req.params.user_address_uuid != null) {
      user_address = await this.user_address_service.findByUUID(
        req.params.user_address_uuid,
      );
    }

    // if we're not using create, get req.user_address
    Object.keys(req.body).forEach(key => {
      const user_editable = this.isUserEditable(key);
      // TODO: this will throw an error if user_address is null
      if (!user_editable && req.body[key] !== (user_address as any)[key]) {
        throw new UnprocessableEntityException(
          `You do not have permission to set user.${key}`,
        );
      }
    });

    return true;
  }
}
