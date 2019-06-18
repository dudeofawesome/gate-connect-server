import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { AuthService } from '../../auth';
import { User, UserService } from '../../user';
import { Gate, GateService } from '../../gate';
import * as Assert from '../assert';

/**
 * Checks if user has access to requested gate
 * Requires the AuthGuard to be run before
 * Assumes that the gate's UUID is set to the :uuid param
 */
@Injectable()
export class GateAccessGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GateService))
    private readonly gateService: GateService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get user & their gate groups
    const req = context.switchToHttp().getRequest<Request>();
    const user: User = req.user;
    Assert.notEqual(
      user,
      null,
      'GateAccessGuard decorator must be run after AuthGuard',
    );
    const user_gate_groups = await this.userService.getGateGroups(user.uuid);

    // get gate UUID and what gate group it's a part of
    const gate_id = req.params.uuid;
    Assert.notEqual(
      gate_id,
      null,
      'GateAccessGuard decorator must be run with a gate `:uuid` param in the URL path',
    );
    const gate_group = await this.gateService.getGateGroup(gate_id);

    // check if gate's group is in user's gate groups
    return (
      user_gate_groups.find(group => group.uuid === gate_group.uuid) != null
    );
  }
}
