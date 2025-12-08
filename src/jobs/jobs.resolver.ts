import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { JobsService } from "./jobs.service";

@Resolver("JobOpportunity")
export class JobsResolver {
  constructor(private jobsService: JobsService) {}

  @Query(() => [Object])
  async jobOpportunities(
    @Args("positionType", { nullable: true }) positionType?: string,
    @Args("country", { nullable: true }) country?: string,
    @Args("city", { nullable: true }) city?: string,
    @Args("status", { nullable: true }) status?: string
  ) {
    return this.jobsService.findAll({ positionType, country, city, status });
  }

  @Query(() => Object, { nullable: true })
  async jobOpportunity(@Args("id") id: string) {
    return this.jobsService.findById(id);
  }

  @Mutation(() => Object)
  async createJobOpportunity(
    @Args("title") title: string,
    @Args("description") description: string,
    @Args("positionType") positionType: string,
    @Args("clubId") clubId: string,
    @Args("country") country: string,
    @Args("city") city: string,
    @Args("salary", { nullable: true }) salary?: number,
    @Args("currency", { nullable: true }) currency?: string,
    @Args("benefits", { nullable: true }) benefits?: string
  ) {
    return this.jobsService.create({
      title,
      description,
      positionType,
      clubId,
      country,
      city,
      salary,
      currency,
      benefits,
    });
  }

  @Mutation(() => Object)
  async updateJobOpportunity(
    @Args("id") id: string,
    @Args("status", { nullable: true }) status?: string
  ) {
    return this.jobsService.update(id, { status });
  }

  @Mutation(() => Boolean)
  async deleteJobOpportunity(@Args("id") id: string) {
    return this.jobsService.delete(id);
  }
}
