import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupUserAccess } from './groupUserAccess.entity';
import { GroupUserAccessService } from './groupUserAccess.service';
import { GroupUserAccessController } from './groupUserAccess.controller';
import { GroupUserAccessResolver } from './groupUserAccess.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([GroupUserAccess])],
  controllers: [GroupUserAccessController],
  providers: [GroupUserAccessService, GroupUserAccessResolver],
  exports: [GroupUserAccessService]
})
export class GroupUserAccessModule {}