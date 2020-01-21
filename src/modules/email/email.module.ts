import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
