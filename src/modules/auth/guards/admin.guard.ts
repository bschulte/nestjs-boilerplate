import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/shared/types';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  public async canActivate(context: ExecutionContext) {
    let request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    const { user } = request;

    return user.isAdmin;
  }
}
