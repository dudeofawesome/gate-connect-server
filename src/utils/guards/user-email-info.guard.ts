import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserEmail } from '../../user_email/user_email.entity';
import { UserEmailService } from '../../user_email/user_email.service';

/** Verify that user has not attempted to change any read-only properties */
@Injectable()
export class UserEmailInfoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly user_email_service: UserEmailService,
  ) {}

  // TODO: This is ugly. Replace this with a decorator that we reflect on
  isUserEditable(key: string) {
    // This is how you might use the decorator in the todo below below
    // const user_editable = this.reflector.get<string[]>(
    //   'email_user_editable',
    //   context.getHandler(),
    // );
    // console.log(user_editable);
    const user_editable_columns = ['email', 'primary'];
    return user_editable_columns.includes(key);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    // TODO: bypass checks if user is admin

    let user_email: Partial<UserEmail> | undefined;
    if (req.params.user_email_uuid != null) {
      user_email = await this.user_email_service.findByUUID(
        req.params.user_email_uuid,
      );
    }

    // if we're not using create, get req.user_address
    Object.keys(req.body).forEach(key => {
      const user_editable = this.isUserEditable(key);
      if (!user_editable && req.body[key] !== (user_email as any)[key]) {
        throw new UnprocessableEntityException(
          `You do not have permission to set user.${key}`,
        );
      }
    });

    return true;
  }
}
