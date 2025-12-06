import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(private payments: PaymentsService) {}

  @Mutation(() => Object)
  async createPaymentIntent(@Args('amount') amount: number, @Args('currency') currency: string) {
    const intent = await this.payments.createPaymentIntent(amount, currency);
    return { clientSecret: intent.client_secret, id: intent.id };
  }
}
