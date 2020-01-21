import {
  Resolver,
  Query,
  ResolveProperty,
  Parent,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserAccess } from '../userAccess/userAccess.entity';
import { UserAccessService } from '../userAccess/userAccess.service';
import { GroupUserAccess } from '../groupUserAccess/groupUserAccess.entity';
import { GroupUserAccessService } from '../groupUserAccess/groupUserAccess.service';
import { UserInputDto } from './dtos/userInput.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Resolver(of => User)
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userAccessService: UserAccessService,
    private readonly groupUserAccessService: GroupUserAccessService,
  ) {}

  @UseGuards(AdminGuard)
  @Query(returns => [User])
  public async adminUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AdminGuard)
  @Query(returns => User)
  public async adminUser(@Args('userId') userId: string) {
    return this.userService.findOne({ id: userId });
  }

  @UseGuards(AdminGuard)
  @Mutation(returns => User)
  public async adminUpdateUser(@Args('userInput') userInput: UserInputDto) {
    await this.userService.update({ id: userInput.id }, userInput);
    return this.userService.findOne({ id: userInput.id });
  }

  @UseGuards(AdminGuard)
  @ResolveProperty(returns => UserAccess)
  public async access(@Parent() user: User) {
    return this.userAccessService.findOne({ userId: user.id });
  }

  // TODO: Restrict group user access
  @ResolveProperty(returns => GroupUserAccess)
  public async groupUserAccess(@Parent() user: User) {
    return this.groupUserAccessService.findOne({ userId: user.id });
  }
}
