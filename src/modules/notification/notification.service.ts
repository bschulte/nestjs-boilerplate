import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base.service';

import { BackendLogger } from '../logger/BackendLogger';
import { Notification } from './notification.entity';
import { NotificationStatus } from 'src/modules/notification/notificationStatus.entity';

@Injectable()
export class NotificationService extends BaseService<NotificationStatus> {
  private readonly logger = new BackendLogger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationStatus)
    private readonly notificationStatusRepository: Repository<
      NotificationStatus
    >,
  ) {
    super(notificationStatusRepository);
  }
}
