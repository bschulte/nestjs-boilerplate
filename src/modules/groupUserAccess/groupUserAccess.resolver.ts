import { Args, Query, Resolver, Context } from '@nestjs/graphql';
import { GroupUserAccess } from './groupUserAccess.entity';
import { GroupUserAccessService } from './groupUserAccess.service';
import { RequestWithUser } from 'src/shared/types';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(of => GroupUserAccess)
@UseGuards(AuthGuard)
export class GroupUserAccessResolver {
  constructor(
    private readonly groupUserAccessService: GroupUserAccessService,
  ) {}
}
