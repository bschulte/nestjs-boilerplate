import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base.service';

import { BackendLogger } from '../logger/BackendLogger';
import { GroupUserAccess } from './groupUserAccess.entity';

@Injectable()
export class GroupUserAccessService extends BaseService<GroupUserAccess> {
  private readonly logger = new BackendLogger(GroupUserAccessService.name);

  constructor(
    @InjectRepository(GroupUserAccess)
    private readonly groupUserAccessRepo: Repository<GroupUserAccess>,
  ) {
    super(groupUserAccessRepo);
  }
}