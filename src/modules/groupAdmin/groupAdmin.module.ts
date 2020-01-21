import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupAdminService } from './groupAdmin.service';
import { GroupAdminController } from './groupAdmin.controller';
import { UserModule } from '../user/user.module';
import { UserAccessModule } from 'src/modules/userAccess/userAccess.module';

@Module({
  imports: [UserAccessModule],
  controllers: [GroupAdminController],
  providers: [GroupAdminService],
  exports: [GroupAdminService],
})
export class GroupAdminModule {}
