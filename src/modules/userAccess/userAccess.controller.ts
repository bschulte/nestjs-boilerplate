import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';

import { BackendLogger } from '../logger/BackendLogger';
import { UserAccessService } from './userAccess.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('userAccess')
@UseGuards(AuthGuard)
export class UserAccessController {
  private readonly logger = new BackendLogger(UserAccessController.name);

  constructor(private readonly userAccessService: UserAccessService) {}
}
