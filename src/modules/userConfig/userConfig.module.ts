
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfig } from './userConfig.entity';
import { UserConfigService } from './userConfig.service';
import { UserConfigController } from './userConfig.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserConfig])],
  controllers: [UserConfigController],
  providers: [UserConfigService],
  exports: [UserConfigService],
})
export class UserConfigModule {}
