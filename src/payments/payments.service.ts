import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-08-01' });
  }

  async createPaymentIntent(amount: number, currency = 'eur') {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
    });
    return intent;
  }
}
