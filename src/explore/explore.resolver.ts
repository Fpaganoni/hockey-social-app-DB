import { Resolver, Query, Args } from "@nestjs/graphql";
import { ExploreService } from "./explore.service";

@Resolver()
export class ExploreResolver {
  constructor(private exploreService: ExploreService) {}

  @Query(() => [Object])
  async exploreUsers(
    @Args("role", { nullable: true }) role?: string,
    @Args("country", { nullable: true }) country?: string,
    @Args("position", { nullable: true }) position?: string,
    @Args("search", { nullable: true }) search?: string,
    @Args("limit", { nullable: true }) limit?: number,
    @Args("offset", { nullable: true }) offset?: number,
  ) {
    return this.exploreService.getExploreUsers({
      role,
      country,
      position,
      search,
      limit,
      offset,
    });
  }

  @Query(() => [Object])
  async exploreClubs(
    @Args("country", { nullable: true }) country?: string,
    @Args("league", { nullable: true }) league?: string,
    @Args("search", { nullable: true }) search?: string,
    @Args("limit", { nullable: true }) limit?: number,
    @Args("offset", { nullable: true }) offset?: number,
  ) {
    return this.exploreService.getExploreClubs({
      country,
      league,
      search,
      limit,
      offset,
    });
  }

  @Query(() => [String])
  async availablePositions() {
    return this.exploreService.getAvailablePositions();
  }

  @Query(() => [String])
  async availableLeagues() {
    return this.exploreService.getAvailableLeagues();
  }

  @Query(() => [String])
  async availableCountries() {
    return this.exploreService.getAvailableCountries();
  }
}
