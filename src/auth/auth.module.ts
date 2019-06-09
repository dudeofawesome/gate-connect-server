import { Module, forwardRef } from '@nestjs/common';
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
      // TODO: consider using `privateKey` instead
      secret: 'secretKey',
      signOptions: {
        // TODO: should be in config
        expiresIn: 3600,
        // TODO: switch to an ECDSA algorithm
        // algorithm: 'ES256',
        // TODO: change this to hostname env var
        issuer: 'api.gate-connect.com',
        // TODO: change to website hostname
        audience: 'gate-connect.com',
      },
    }),
    forwardRef(() => UserModule),
    UserTokenModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, AuthService, passportModule],
})
export class AuthModule {}
