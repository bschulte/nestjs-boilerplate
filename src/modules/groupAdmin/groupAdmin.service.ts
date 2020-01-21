import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as _ from 'lodash';

import { BackendLogger } from '../logger/BackendLogger';
import { UserService } from 'src/modules/user/user.service';
import { UserAccessService } from 'src/modules/userAccess/userAccess.service';
import { EmailService } from 'src/modules/email/email.service';
import { UpdateGroupUserDto } from 'src/modules/groupAdmin/dtos/updateGroupUser.dto';
import { AuditService } from 'src/modules/audit/audit.service';

@Injectable()
export class GroupAdminService {
  private readonly logger = new BackendLogger(GroupAdminService.name);

  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly auditService: AuditService,
  ) {}

  public async createNewUser(
    adminUserId: string,
    email: string,
    group: string,
  ) {
    this.logger.debug(`Creating new user for group admin: ${email}`);

    const {
      successfullyCreatedUser,
      generatedPassword,
    } = await this.userService.createUser(email);

    if (!successfullyCreatedUser) {
      this.logger.error(`Error creating user for group admin: ${email}`);
      throw new InternalServerErrorException('Error creating user');
    }

    await this.userService.update(
      { email },
      {
        group,
        needsPasswordChange: true,
      },
    );

    // Email the new user
    await this.emailService.sendEmail({
      templateName: 'emailNewUser',
      templateParams: [generatedPassword],
      subject: `[INSERT TITLE HERE] Your account has been created`,
      isInternal: false,
      userEmail: email,
      title: 'Nest Account Created',
    });

    await this.auditService.create({
      type: 'Create New Group User',
      meta: { email },
      userId: adminUserId,
    });

    return { msg: 'Successfully created the new user' };
  }

  public async getUsers(group: string) {
    this.logger.debug(`Getting users for group: ${group}`);
    const users = await this.userService.findGroupUsers(group);

    return users;
  }

  public async updateGroupUser(
    adminUserId: string,
    userId: string,
    updateGroupUserDto: UpdateGroupUserDto,
  ) {
    this.logger.debug(
      `Updating user: ${userId}, with dto: ${JSON.stringify(
        updateGroupUserDto,
      )}`,
    );

    // "locked" is a value on the users table, so we need to break that out of the other
    // dto values
    const { locked, subGroups, ...accessValues } = updateGroupUserDto;

    if ('locked' in updateGroupUserDto) {
      await this.userService.update({ id: userId }, { locked });
    }

    // if ('sub_groups' in updateGroupUserDto) {
    //   await this.userService.update({ id: userId }, { subGroups: subGroups });
    // }

    // TODO: Change to update the groupUserAccess now
    // if (!_.isEmpty(accessValues)) {
    //   await this.userAccessService.update({ userId }, accessValues);
    // }

    await this.auditService.create({
      type: 'Modify Group User',
      userId: adminUserId,
      meta: updateGroupUserDto,
    });

    return { success: true };
  }
}
