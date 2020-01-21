import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { UserService } from 'src/modules/user/user.service';
import { RequestWithUser } from 'src/shared/types';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { DotenvService } from 'src/modules/dotenv/dotenv.service';
import { SessionMiddleware } from 'src/middleware/session.middleware';
import { SESSION_USER } from 'src/shared/constants';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new BackendLogger(AuthMiddleware.name);

  constructor(
    private readonly userService: UserService,
    private readonly dotenvService: DotenvService,
  ) {}

  public async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // Check API key first
    const apiKey = req.query.key || req.body.key;
    let user: User;

    // Check API key first
    if (apiKey) {
      user = await this.userService.findOne({ apiKey }, ['access']);
      if (!user) {
        this.logger.warn(`Unauthorized exception for url: ${req.originalUrl}`);
        throw new UnauthorizedException();
      }

      req.user = user;
      SessionMiddleware.set(SESSION_USER, user);
      return next();
    }

    // Try JWT next
    const token = this.getTokenFromReq(req);
    if (!token) {
      return next();
    }

    try {
      const payload: any = jwt.verify(token, this.dotenvService.get('APP_KEY'));
      user = await this.userService.findOne({ email: payload.email }, [
        'access',
      ]);
    } catch (err) {
      // This should be a debug message, since regularly JWTs will expire
      // during normal use of the portal so we don't want to raise alarms
      // when we can't verify it
      this.logger.debug(`Error verifying JWT: ${err}`);
    }

    SessionMiddleware.set(SESSION_USER, user);
    req.user = user;

    return next();
  }

  private getTokenFromReq(req: Request) {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
      authHeader = decodeURIComponent(req.query.token) || req.body.token;
    }

    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    return token;
  }
}
