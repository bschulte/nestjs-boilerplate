import { Test } from '@nestjs/testing';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });
});
