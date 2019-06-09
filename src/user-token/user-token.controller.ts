import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserTokenService } from './user-token.service';
import { UserToken } from './user-token.entity';

@Controller('user-token')
export class UserTokenController {
  constructor(
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
  ) {}
}
