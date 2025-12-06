import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TeamsService } from './teams.service';

@Resolver('Team')
export class TeamsResolver {
  constructor(private teamsService: TeamsService) {}

  @Mutation(() => Object)
  async createTeam(@Args('name') name: string, @Args('category') category: string, @Args('clubId') clubId: string) {
    return this.teamsService.createTeam({ name, category, clubId });
  }

  @Query(() => [Object])
  async teamsByClub(@Args('clubId') clubId: string) {
    return this.teamsService.listByClub(clubId);
  }
}
