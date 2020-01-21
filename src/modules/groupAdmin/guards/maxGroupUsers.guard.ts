import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class MaxGroupUsersGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Check if the user has reached their max number of group users
    const groupUsers = await this.userService.findGroupUsers(
      request.user.group,
    );
    return groupUsers.length < request.user.access.max_group_users;
  }
}
