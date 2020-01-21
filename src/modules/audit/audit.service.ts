import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base.service';

import { BackendLogger } from '../logger/BackendLogger';
import { Audit } from './audit.entity';
import { UtilService } from 'src/modules/util/util.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuditService extends BaseService<Audit> {
  private readonly logger = new BackendLogger(AuditService.name);

  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super(auditRepository);
  }

  public async findAllForGroup(group: string) {
    const groupUserIds = await this.userService.findGroupIds(group);

    return this.auditRepository
      .createQueryBuilder('a')
      .select(['a.type', 'a.meta', 'a.created_at', 'a.userId', 'u.email'])
      .leftJoin('a.user', 'u')
      .where('a.userId IN (:...userIds)', { userIds: groupUserIds })
      .getMany();
  }
}
