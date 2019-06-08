import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService, JwtStrategy, AuthController } from './';
import { UserModule } from '../user/user.module';
import { UserTokenModule } from '../user-token/user-token.module';

export const passportModule = PassportModule.register({
  defaultStrategy: 'jwt',
});

@Module({
  imports: [
    passportModule,
    JwtModule.register({
      // TODO: change the key!
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        // TODO: should be in config
        expiresIn: 3600,
      },
    }),
    UserModule,
    UserTokenModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, AuthService, passportModule],
})
export class AuthModule {}
