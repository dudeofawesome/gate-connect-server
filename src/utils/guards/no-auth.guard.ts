import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';

/** Prevents authenticated users from accessing endpoint */
@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization
      ? req.headers.authorization.substr('Bearer '.length)
      : null;
    if (token == null) {
      return true;
    } else {
      try {
        await this.authService.validateToken(token);
        return false;
      } catch (err) {
        return true;
      }
    }
  }
}
