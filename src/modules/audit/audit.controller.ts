import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Request,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BackendLogger } from '../logger/BackendLogger';
import { RequestWithUser } from 'src/shared/types';
import { AuditService } from 'src/modules/audit/audit.service';
import { GroupAdminGuard } from 'src/modules/groupAdmin/guards/groupAdmin.guard';

@Controller('audit-entries')
@UseGuards(GroupAdminGuard)
export class AuditController {
  private readonly logger = new BackendLogger(AuditController.name);

  constructor(private readonly auditService: AuditService) {}

  @Get('/')
  public async getAuditEntries(@Request() req: RequestWithUser) {
    return this.auditService.findAllForGroup(req.user.group);
  }
}
