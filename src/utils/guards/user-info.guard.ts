import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

/** Verify that user has not attempted to change any read-only properties */
@Injectable()
export class UserInfoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // TODO: This is ugly. Replace this with a decorator that we reflect on
  isUserEditable(key: string) {
    // This is how you might use the decorator in the todo below below
    // const user_editable = this.reflector.get<string[]>(
    //   'email_user_editable',
    //   context.getHandler(),
    // );
    // console.log(user_editable);
    const user_editable_columns = ['email', 'name', 'address'];
    return user_editable_columns.includes(key);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // TODO: bypass checks if user is admin
    Object.keys(req.body).forEach(key => {
      const user_editable = this.isUserEditable(key);
      if (
        !user_editable &&
        req.user != null &&
        req.body[key] !== req.user[key]
      ) {
        throw new UnprocessableEntityException(
          `You do not have permission to set user.${key}`,
        );
      }
    });

    return true;
  }
}
