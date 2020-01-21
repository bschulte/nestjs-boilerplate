import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Request,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BackendLogger } from '../logger/BackendLogger';
import { GroupAdminService } from './groupAdmin.service';
import { GroupAdminGuard } from 'src/modules/groupAdmin/guards/groupAdmin.guard';
import { MaxGroupUsersGuard } from 'src/modules/groupAdmin/guards/maxGroupUsers.guard';
import { RequestWithUser } from 'src/shared/types';
import { NewUserDto } from 'src/modules/groupAdmin/dtos/newUser.dto';
import { UpdateGroupUserDto } from 'src/modules/groupAdmin/dtos/updateGroupUser.dto';
import { CanEditUserGuard } from 'src/modules/groupAdmin/guards/canEditUser.guard';

@Controller('group-admin')
@UseGuards(GroupAdminGuard)
export class GroupAdminController {
  private readonly logger = new BackendLogger(GroupAdminController.name);

  constructor(private readonly groupAdminService: GroupAdminService) {}

  @Get('/users')
  public async getUsers(@Request() req: RequestWithUser) {
    return this.groupAdminService.getUsers(req.user.group);
  }

  @Post('/users')
  @UseGuards(MaxGroupUsersGuard)
  public async createNewGroupUser(
    @Request() req: RequestWithUser,
    @Body() { email }: NewUserDto,
  ) {
    return this.groupAdminService.createNewUser(
      req.user.id,
      email,
      req.user.group,
    );
  }

  @Put('/users/:userId')
  @UseGuards(CanEditUserGuard)
  public async modifyGroupUser(
    @Request() req: RequestWithUser,
    @Body() updateGroupUserDto: UpdateGroupUserDto,
    @Param('userId') userId: string,
  ) {
    return this.groupAdminService.updateGroupUser(
      req.user.id,
      userId,
      updateGroupUserDto,
    );
  }
}
