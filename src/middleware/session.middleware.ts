import * as cls from 'cls-hooked';
import uniqid from 'uniqid';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { NEST_NAMESPACE, REQUEST_ID } from '../shared/constants';
import { NextFunction } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  public static createDefault() {
    return (
      cls.getNamespace(NEST_NAMESPACE) || cls.createNamespace(NEST_NAMESPACE)
    );
  }

  public static get(key: string) {
    const session = cls.getNamespace(NEST_NAMESPACE);
    if (!session) {
      return null;
    }

    return session.get(key);
  }

  public static set(key: string, value: any) {
    const session = cls.getNamespace(NEST_NAMESPACE);
    if (!session) {
      return null;
    }

    session.set(key, value);
  }

  public use(req: Request, res: Response, next: NextFunction) {
    const session = SessionMiddleware.createDefault();

    session.run(async () => {
      SessionMiddleware.set(REQUEST_ID, uniqid());
      next();
    });
  }
}
