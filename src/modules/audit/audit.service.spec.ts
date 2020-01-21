import { Test } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './audit.entity';

describe('AuditService', () => {
  let auditService: AuditService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Audit])],
      providers: [AuditService],
    }).compile();

    auditService = module.get<AuditService>(AuditService);
  });
});
