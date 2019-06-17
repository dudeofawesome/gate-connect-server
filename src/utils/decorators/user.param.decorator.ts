import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user';

/**
 * Gets user object from Request
 */
export const UserParam = createParamDecorator((data, req: Request) => {
  return req.user as User;
});
