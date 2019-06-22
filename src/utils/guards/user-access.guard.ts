import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as Assert from '../assert';

/** Verify user's uuid matches what's in the url uuid */
@Injectable()
export class UserAccess implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    Assert.notEqual(
      req.params.user_uuid,
      null,
      'Request path must include user_uuid parameter',
    );
    return req.user.uuid === req.params.user_uuid;
  }
}
