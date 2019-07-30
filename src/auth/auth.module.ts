import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserTokenModule } from '../user-token/user-token.module';

export const passportModule = PassportModule.register({
  defaultStrategy: 'bearer',
});

@Module({
  imports: [passportModule, forwardRef(() => UserModule), UserTokenModule],
  providers: [AuthService, HttpStrategy],
  controllers: [AuthController],
  exports: [PassportModule, AuthService, passportModule],
})
export class AuthModule {}
