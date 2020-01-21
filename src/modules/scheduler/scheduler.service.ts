import { Injectable } from '@nestjs/common';
import schedule from 'node-schedule';

import { BackendLogger } from '../logger/BackendLogger';
import { AppSubmissionService } from '../appSubmission/appSubmission.service';
import { AppStatusHelper } from '../appSubmission/helpers/appStatus.helper';
import { AppSubscriptionService } from '../appSubscription/appSubscription.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new BackendLogger(SchedulerService.name);

  constructor(
    private readonly appSubmissionService: AppSubmissionService,
    private readonly appStatusHelper: AppStatusHelper,
    private readonly appSubscriptionService: AppSubscriptionService,
  ) {}

  public async setupTasks() {
    // Submitting apps
    schedule.scheduleJob('* * * * *', async () => {
      try {
        await this.appSubmissionService.submitAllAppsForAnalysis();
      } catch (err) {
        this.logger.error(
          `Error attempting to submit apps to internal servers: ${err}`,
        );
      }
    });

    // Checking on submitted apps
    schedule.scheduleJob('*/5 * * * *', async () => {
      try {
        await this.appStatusHelper.checkOnAllApps();
      } catch (err) {
        this.logger.error(
          `Error attempting to submit apps to internal servers: ${err}`,
        );
      }
    });

    // Schedule submitting all subscriptions
    schedule.scheduleJob('0 20 * * *', async () => {
      try {
        await this.appSubscriptionService.submitSubscriptions();
      } catch (err) {
        this.logger.error(`Error submitting subscriptions: ${err}`);
      }
    });
  }
}
