
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupAdmin } from './groupAdmin.entity'
import { GroupAdminService } from './groupAdmin.service';

describe('GroupAdminService', () => {
  let groupAdminService: GroupAdminService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([GroupAdmin])],
      providers: [GroupAdminService]
    }).compile();

    groupAdminService = module.get<GroupAdminService>(GroupAdminService);
  });

});
  