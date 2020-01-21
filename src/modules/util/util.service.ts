import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as cp from 'child_process';
import * as util from 'util';
import moment from 'moment';

import { BackendLogger } from '../logger/BackendLogger';
import { UserService } from 'src/modules/user/user.service';
import { DotenvService } from '../dotenv/dotenv.service';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class UtilService {
  private readonly logger = new BackendLogger(UtilService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly dotenvService: DotenvService,
  ) {}

  /**
   * Pauses execution for a given amount of ms
   */
  public async sleep(ms: number) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    });
  }

  /**
   * Uses util.promisify to use the native child_process module exec
   * in an async fashion
   *
   * @param {string} command Command to execute
   */
  public asyncExec(cmd: string, options: cp.ExecOptions = {}) {
    const exec = util.promisify(cp.exec);

    return exec(cmd, options);
  }

  public async getUserWhereClause(user: User) {
    // Check if the user is part of a group. If they are, get the groups applications,
    // not just the user's own apps
    const userIds = await this.getUserIds(user);

    const userWhereClause = name => [
      `${name}.userId IN (:...userIds)`,
      { userIds },
    ];

    return userWhereClause;
  }

  public async getUserIds(user: User) {
    let userIds: string[];

    if (user.group) {
      // If the user is part of a sub group, find IDs that match both their group
      // *and* their subgroup
      if (user.subGroups.length > 0) {
        userIds = await this.userService.findSubGroupIds(
          user.group,
          user.subGroups,
        );
      } else {
        userIds = await this.userService.findGroupIds(user.group);
      }
    } else {
      userIds = [user.id];
    }

    return userIds;
  }
}
