import { Test } from '@nestjs/testing';
import { UtilService } from './util.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UtilService', () => {
  let utilService: UtilService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [UtilService],
    }).compile();

    utilService = module.get<UtilService>(UtilService);
  });
});
