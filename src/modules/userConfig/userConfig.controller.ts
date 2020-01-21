import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Put,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BackendLogger } from '../logger/BackendLogger';
import { UserConfigService } from './userConfig.service';
import { RequestWithUser } from 'src/shared/types';
import { UpdateUserConfigDto } from 'src/modules/userConfig/dtos/updateUserConfig.dto';
import { ConfigAccessGuard } from 'src/modules/userConfig/configAccess.guard';

@Controller('user-config')
export class UserConfigController {
  private readonly logger = new BackendLogger(UserConfigController.name);

  constructor(private readonly userConfigService: UserConfigService) {}

  @Put('/')
  public async updateUserConfig(
    @Request() req: RequestWithUser,
    @Body() updateValues: UpdateUserConfigDto,
  ) {
    return this.userConfigService.updateValues(req.user.id, updateValues);
  }

  @Put('/:userId')
  @UseGuards(ConfigAccessGuard)
  public async updateUserConfigWithUserId(
    @Param('userId') userId: string,
    @Body() updateValues: UpdateUserConfigDto,
  ) {
    return this.userConfigService.updateValues(userId, updateValues);
  }
}
