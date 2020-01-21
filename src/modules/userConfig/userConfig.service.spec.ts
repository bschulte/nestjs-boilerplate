import { Test } from '@nestjs/testing';
import { UserConfigService } from './userConfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfig } from './userConfig.entity';

describe('UserConfigService', () => {
  let userConfigService: UserConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserConfig])],
      providers: [UserConfigService],
    }).compile();

    userConfigService = module.get<UserConfigService>(UserConfigService);
  });
});
