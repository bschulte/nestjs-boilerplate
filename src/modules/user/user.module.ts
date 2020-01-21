import { Module, Global, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserConfig } from '../userConfig/userConfig.entity';
import { UserAccess } from '../userAccess/userAccess.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoginRecord } from './loginRecord.entity';
import { UserConfigModule } from '../userConfig/userConfig.module';
import { UserAccessModule } from '../userAccess/userAccess.module';
import { UserCommand } from './user.command';
import { UserResolver } from './user.resolver';
import { GroupUserAccessModule } from '../groupUserAccess/groupUserAccess.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserConfig, UserAccess, LoginRecord]),
    UserConfigModule,
    UserAccessModule,
    GroupUserAccessModule,
  ],
  providers: [UserService, UserCommand, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
