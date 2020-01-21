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
  Delete,
} from '@nestjs/common';

import { BackendLogger } from '../logger/BackendLogger';
import { NotificationService } from './notification.service';
import { RequestWithUser } from 'src/shared/types';
import { UpdateNotificationDto } from 'src/modules/notification/dtos/updateNotification.dto';
import { Not } from 'typeorm';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  private readonly logger = new BackendLogger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get('/')
  public async getNotifications(@Request() req: RequestWithUser) {
    return this.notificationService.findAll(
      // To get around: https://github.com/typeorm/typeorm/issues/3460
      // @ts-ignore
      { userId: req.user.id, status: Not('deleted') },
      ['notification'],
    );
  }

  @Put('/:notificationStatusUuid')
  public async modifyNotification(
    @Request() req: RequestWithUser,
    @Param('notificationStatusUuid') notificationStatusUuid: string,
    @Body() { status }: UpdateNotificationDto,
  ) {
    await this.notificationService.update(
      { userId: req.user.id, uuid: notificationStatusUuid },
      {
        status,
      },
    );

    return { success: true };
  }

  @Delete('/:notificationStatusUuid')
  public async deleteNotification(
    @Request() req: RequestWithUser,
    @Param('notificationStatusUuid') notificationStatusUuid: string,
  ) {
    await this.notificationService.update(
      { userId: req.user.id, uuid: notificationStatusUuid },
      {
        status: 'deleted',
      },
    );

    return { success: true };
  }
}
