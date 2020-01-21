import { Module, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AppSubscriptionModule } from '../appSubscription/appSubscription.module';

@Module({
  imports: [AppSubscriptionModule],
  controllers: [],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule implements OnModuleInit {
  constructor(private readonly schedulerService: SchedulerService) {}

  public async onModuleInit() {
    this.schedulerService.setupTasks();
  }
}
