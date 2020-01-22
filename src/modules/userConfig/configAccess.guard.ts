import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { RequestWithUser } from 'src/shared/types';

@Injectable()
export class ConfigAccessGuard implements CanActivate {
  private readonly logger = new BackendLogger(ConfigAccessGuard.name);

  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const userId = request.params.userId;
    if (!userId) {
      this.logger.warn(
        `No userId param for request to: ${request.originalUrl}`,
      );
      throw new BadRequestException('No user id');
    }

    const { user } = request;

    // Allow configs to be updated by the user who owns them or site admins
    return user.isAdmin || user.id === userId;
  }
}
