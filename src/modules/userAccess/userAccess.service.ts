import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base.service';

import { BackendLogger } from '../logger/BackendLogger';
import { UserAccess } from './userAccess.entity';

@Injectable()
export class UserAccessService extends BaseService<UserAccess> {
  private readonly logger = new BackendLogger(UserAccessService.name);

  constructor(
    @InjectRepository(UserAccess)
    private readonly userAccessRepository: Repository<UserAccess>,
  ) {
    super(userAccessRepository);
  }
}
