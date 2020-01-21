import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupUserAccess } from './groupUserAccess.entity'
import { GroupUserAccessService } from './groupUserAccess.service';

describe('GroupUserAccessService', () => {
  let groupUserAccessService: GroupUserAccessService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([GroupUserAccess])],
      providers: [GroupUserAccessService]
    }).compile();

    groupUserAccessService = module.get<GroupUserAccessService>(GroupUserAccessService);
  });

});
  