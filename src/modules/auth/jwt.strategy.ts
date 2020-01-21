import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { BackendLogger } from '../logger/BackendLogger';
import { SESSION_USER } from '../../shared/constants';
import { SessionMiddleware } from '../../middleware/session.middleware';
import { UserService } from '../user/user.service';
import { DotenvService } from '../dotenv/dotenv.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new BackendLogger(JwtStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly dotenvService: DotenvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: dotenvService.get('APP_KEY'),
    });
  }

  public async validate(payload: { email: string }) {
    const user = await this.userService.findOne({ email: payload.email });

    if (!user) {
      this.logger.debug(`Invalid/expired payload: ${JSON.stringify(payload)}`);
      throw new UnauthorizedException();
    }
    SessionMiddleware.set(SESSION_USER, user);

    return user;
  }
}
