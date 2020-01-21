import { Test } from '@nestjs/testing';
import { UserAccessService } from './userAccess.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './userAccess.entity';

describe('UserAccessService', () => {
  let userAccessService: UserAccessService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserAccess])],
      providers: [UserAccessService],
    }).compile();

    userAccessService = module.get<UserAccessService>(UserAccessService);
  });
});
