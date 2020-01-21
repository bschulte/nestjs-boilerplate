import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BackendLogger } from '../logger/BackendLogger';
import { UserConfig } from './userConfig.entity';
import { BaseService } from '../../base.service';
import { UpdateUserConfigDto } from 'src/modules/userConfig/dtos/updateUserConfig.dto';

@Injectable()
export class UserConfigService extends BaseService<UserConfig> {
  private readonly logger = new BackendLogger(UserConfigService.name);

  constructor(
    @InjectRepository(UserConfig)
    private readonly userConfigRepository: Repository<UserConfig>,
  ) {
    super(userConfigRepository);
  }

  public async updateValues(userId: string, values: UpdateUserConfigDto) {
    this.logger.silly(
      `Updating user (${userId}) config values to: ${JSON.stringify(values)}`,
    );
    await this.update({ userId }, values);

    return { success: true };
  }
}
