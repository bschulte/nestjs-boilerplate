import { Injectable } from '@nestjs/common';
import schedule from 'node-schedule';

import { BackendLogger } from '../logger/BackendLogger';

@Injectable()
export class SchedulerService {
  private readonly logger = new BackendLogger(SchedulerService.name);

  public async setupTasks() {}
}
