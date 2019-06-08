import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy<typeof Strategy>(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO: change the key!
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: JwtPayload) {
    Logger.log('VALIDATING!');
    Logger.log(payload);
    try {
      return await this.authService.validateJWT(payload);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
