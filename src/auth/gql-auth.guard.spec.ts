import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GqlAuthGuard } from "./gql-auth.guard";

// Minimal mock: we only care that getRequest extracts req from the GQL context
jest.mock("@nestjs/graphql", () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe("GqlAuthGuard", () => {
  let guard: GqlAuthGuard;

  beforeEach(() => {
    guard = new GqlAuthGuard();
  });

  afterEach(() => jest.clearAllMocks());

  it("should extract req from GQL context", () => {
    const mockReq = { headers: { authorization: "Bearer test-token" } };
    const mockGqlCtx = { getContext: jest.fn().mockReturnValue({ req: mockReq }) };
    (GqlExecutionContext.create as jest.Mock).mockReturnValue(mockGqlCtx);

    const mockContext = {} as ExecutionContext;
    const result = guard.getRequest(mockContext);

    expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    expect(result).toBe(mockReq);
  });

  it("should pass req even when authorization header is absent", () => {
    const mockReq = { headers: {} };
    const mockGqlCtx = { getContext: jest.fn().mockReturnValue({ req: mockReq }) };
    (GqlExecutionContext.create as jest.Mock).mockReturnValue(mockGqlCtx);

    const result = guard.getRequest({} as ExecutionContext);

    // Guard must not throw — passport-jwt handles missing token downstream
    expect(result).toBe(mockReq);
  });
});
