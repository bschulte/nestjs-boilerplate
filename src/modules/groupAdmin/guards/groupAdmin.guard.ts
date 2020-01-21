import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class GroupAdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Check if the user is a group admin
    return request.user && request.user.access.group_admin;
  }
}
