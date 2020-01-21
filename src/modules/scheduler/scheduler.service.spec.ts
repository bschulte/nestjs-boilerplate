import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
  let schedulerService: SchedulerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [SchedulerService],
    }).compile();

    schedulerService = module.get<SchedulerService>(SchedulerService);
  });
});
