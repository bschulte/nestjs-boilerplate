import { Module, Global, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './audit.entity';
import { AuditService } from './audit.service';
import { UserModule } from '../user/user.module';
import { AuditController } from './audit.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
