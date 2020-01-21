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
export class CanEditUserGuard implements CanActivate {
  private readonly logger = new BackendLogger(CanEditUserGuard.name);

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

    const userToEdit = await this.userService.findOne({ id: userId });
    const user = request.user;

    // Allow the request if the authenticated user's group matches the user to edit's group
    return user.group === userToEdit.group;
  }
}
