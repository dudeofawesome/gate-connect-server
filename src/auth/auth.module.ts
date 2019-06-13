import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService, HttpStrategy, AuthController } from './';
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
