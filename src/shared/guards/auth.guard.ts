import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/shared/types';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BackendLogger } from 'src/modules/logger/BackendLogger';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new BackendLogger(AuthGuard.name);

  public async canActivate(context: ExecutionContext) {
    let request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    if (!request.user) {
      this.logger.warn(`No user found for request: ${request.path}`);
    }

    return !!request.user;
  }
}
