import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BackendLogger } from '../logger/BackendLogger';
import { GroupUserAccessService } from './groupUserAccess.service';

@Controller('groupUserAccess')
export class GroupUserAccessController {
  private readonly logger = new BackendLogger(GroupUserAccessController.name);

  constructor(private readonly groupUserAccessService: GroupUserAccessService) {}
}