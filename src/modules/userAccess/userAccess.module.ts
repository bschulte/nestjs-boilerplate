import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './userAccess.entity';
import { UserAccessService } from './userAccess.service';
import { UserAccessController } from './userAccess.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccess])],
  controllers: [UserAccessController],
  providers: [UserAccessService],
  exports: [UserAccessService],
})
export class UserAccessModule {}
