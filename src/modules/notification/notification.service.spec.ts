import { Test } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Notification])],
      providers: [NotificationService],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
  });
});
