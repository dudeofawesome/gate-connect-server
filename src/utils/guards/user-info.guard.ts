import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user';
import { Reflector } from '@nestjs/core';

/** Verify that user has not attempted to change any read-only properties */
@Injectable()
export class UserInfoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  isUserEditable(key: string) {
    const user_editable_columns = ['email', 'name', 'address'];
    return user_editable_columns.includes(key);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // TODO: bypass checks if user is admin
    Object.keys(req.user).forEach(key => {
      const user_editable = this.isUserEditable(key);
      if (
        req.body[key] != null &&
        req.body[key] !== req.user[key] &&
        req.user[key] !== user_editable
      ) {
        throw new UnprocessableEntityException(
          `You do not have permission to set user.${key}`,
        );
      }
    });

    return true;
  }
}