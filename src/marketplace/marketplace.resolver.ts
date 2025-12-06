import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MarketplaceService } from './marketplace.service';

@Resolver('Service')
export class MarketplaceResolver {
  constructor(private marketplace: MarketplaceService) {}

  @Query(() => [Object])
  async services() {
    return this.marketplace.listServices();
  }

  @Mutation(() => Object)
  async createService(@Args('title') title: string, @Args('description') description: string, @Args('providerId') providerId: string, @Args('priceAmount') priceAmount: number) {
    return this.marketplace.createService({ title, description, providerId, priceAmount });
  }
}
