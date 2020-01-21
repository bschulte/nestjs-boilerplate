import { Module, Global, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilService } from './util.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
