import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "./payments.service";

// Mock Stripe at module level — never hit the network in unit tests
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
    },
  }));
});

import Stripe from "stripe";

describe("PaymentsService", () => {
  let service: PaymentsService;
  let stripeInstance: jest.Mocked<{ paymentIntents: { create: jest.Mock } }>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    // Access the mocked Stripe instance created inside the service constructor
    stripeInstance = (Stripe as unknown as jest.Mock).mock.results[0].value;

    jest.clearAllMocks();
  });

  // ── createPaymentIntent ───────────────────────────────────────────────────
  describe("createPaymentIntent", () => {
    it("should create a payment intent with amount converted to cents", async () => {
      const mockIntent = { id: "pi_test_123", amount: 2999, currency: "eur", status: "created" };
      stripeInstance.paymentIntents.create.mockResolvedValue(mockIntent);

      const result = await service.createPaymentIntent(29.99);

      expect(stripeInstance.paymentIntents.create).toHaveBeenCalledWith({
        amount: 2999, // 29.99 * 100, rounded
        currency: "eur",
      });
      expect(result).toEqual(mockIntent);
    });

    it("should use default currency 'eur' when not specified", async () => {
      stripeInstance.paymentIntents.create.mockResolvedValue({ id: "pi_001" });

      await service.createPaymentIntent(10);

      const callArg = stripeInstance.paymentIntents.create.mock.calls[0][0];
      expect(callArg.currency).toBe("eur");
    });

    it("should accept a custom currency", async () => {
      stripeInstance.paymentIntents.create.mockResolvedValue({ id: "pi_002" });

      await service.createPaymentIntent(50, "usd");

      const callArg = stripeInstance.paymentIntents.create.mock.calls[0][0];
      expect(callArg.currency).toBe("usd");
    });

    it("should correctly round floating point amounts to avoid Stripe rejection", async () => {
      // 19.999 * 100 = 1999.9 → Math.round → 2000 (cents). Stripe rejects non-integer amounts.
      stripeInstance.paymentIntents.create.mockResolvedValue({ id: "pi_003" });

      await service.createPaymentIntent(19.999);

      const callArg = stripeInstance.paymentIntents.create.mock.calls[0][0];
      expect(Number.isInteger(callArg.amount)).toBe(true);
      expect(callArg.amount).toBe(2000);
    });

    it("should propagate Stripe API errors to the caller", async () => {
      stripeInstance.paymentIntents.create.mockRejectedValue(
        new Error("Your card has insufficient funds.")
      );

      await expect(service.createPaymentIntent(100)).rejects.toThrow(
        "Your card has insufficient funds."
      );
    });
  });
});
