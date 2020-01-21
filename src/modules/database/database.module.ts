import { Module } from '@nestjs/common';
import { DatabaseCommand } from './database.command';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseCommand],
  exports: [],
})
export class DatabaseModule {}
