# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Hockey Connect** — A NestJS + GraphQL + Prisma boilerplate for a hockey talent network and community platform. The backend exposes a GraphQL API running on port 4000, with PostgreSQL as the database.

**Key Stack:**
- NestJS 11 with GraphQL (Apollo Server)
- Prisma ORM + PostgreSQL
- JWT + OAuth 2.0 (Google, Apple Sign In)
- WebSocket notifications (Socket.IO)
- AWS S3 + Cloudinary for file uploads
- Stripe for payments
- ElasticSearch + Algolia for search (skeleton adapters)

## Development Commands

```bash
# Start development server (watch mode)
pnpm start:dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database setup
pnpm prisma:generate      # Generate Prisma client after schema changes
pnpm prisma:migrate       # Run pending migrations (interactive)
pnpm prisma:seed          # Seed database with initial data
pnpm prisma:reset         # ⚠️ DESTRUCTIVE: reset DB and re-run migrations + seed

# Testing
pnpm test                  # Run tests once
pnpm test:watch            # Watch mode
pnpm test:cov              # With coverage report

# Linting
pnpm lint                  # ESLint check
```

**GraphQL Endpoint:** http://localhost:4000/graphql (Apollo Playground available)

## Architecture & Module Structure

### Modular Design Pattern
Each feature is organized as a **NestJS module** with this structure:
```
src/[feature]/
  ├─ [feature].module.ts      (NestJS module configuration)
  ├─ [feature].resolver.ts     (GraphQL resolvers)
  ├─ [feature].service.ts      (business logic)
  └─ [feature].service.spec.ts (Jest tests)
```

### Core Modules & Responsibilities

| Module | Purpose | Key Files |
|--------|---------|-----------|
| **auth** | JWT + OAuth 2.0 strategies (Google, Apple) | `jwt.strategy.ts`, `google.strategy.ts`, `apple.strategy.ts`, `gql-auth.guard.ts` |
| **users** | User registration, profiles, avatar uploads | `users.service.ts`, `users.resolver.ts` |
| **clubs** | Club management, membership, invitations, admin controls | `clubs.service.ts`, `clubs.resolver.ts` |
| **teams** | Team creation and management | `teams.service.ts` |
| **posts** | Feed posts, comments, likes | `posts.resolver.ts`, `posts.service.ts` |
| **follow** | User-to-user following relationships | `follow.service.ts` |
| **messaging** | Direct messages and conversations | `messaging.resolver.ts`, `messaging.service.ts` |
| **stories** | User stories (ephemeral content) | `stories.service.ts` |
| **jobs** | Job listings and applications | `jobs.resolver.ts`, `jobs.service.ts` |
| **payments** | Stripe integration for payments | `payments.resolver.ts`, `payments.service.ts` |
| **notifications** | Real-time WebSocket notifications (Socket.IO) | `notifications.gateway.ts` |
| **search** | Search service (Algolia/ElasticSearch adapters) | `search.service.ts` |
| **uploads** | Avatar/image upload orchestration | `uploads.resolver.ts` |

### Global Infrastructure

- **PrismaService** (`src/prisma.service.ts`) — Singleton database client, injected into every module
- **GraphQL Module** (`src/graphql.module.ts`) — Apollo Server configuration with:
  - Depth limiting (protects against deeply nested queries)
  - Error masking (prevents Prisma/SQL leaks)
  - Validation error standardization
- **App Module** (`src/app.module.ts`) — Root module that imports all features and configures:
  - Throttling guard (100 requests/minute per IP)
  - CORS with dynamic origin matching (FRONTEND_URL env var)
  - Global exception filter with Prisma data leak prevention
  - Validation pipe (whitelist DTO properties, forbid extras, auto-transform)

## Database Schema (Prisma)

The schema is defined in `prisma/schema.prisma` with these key models:

- **User** — Core user model with OAuth fields (`authProvider`, `socialId`) and role-based access (PLAYER, COACH, CLUB_ADMIN)
- **Club** — Club entity with members and administrators
- **ClubMember** — Many-to-many join model for users in clubs (with invitation tracking)
- **Post** — Feed posts with comments and likes
- **Follow** — User-to-user follow relationships
- **Conversation** — Direct message conversations with participants
- **Message** — Individual messages within conversations
- **Story** — Time-limited user content with view tracking
- **JobApplication** — Job postings and user applications
- And more (Comments, Likes, Shares, Statistics, Trajectories)

**Critical Performance Notes:**
- Heavy use of indexes on role, position, country, city (talent search)
- OAuth lookup indexes: `[authProvider, socialId]` for fast Google/Apple auth
- Email verification token tracking for secure account recovery

## Authentication & Authorization

### JWT Strategy (`src/auth/jwt.strategy.ts`)
- Extracts Bearer token from Authorization header
- Validates with `JWT_SECRET` env var
- Attaches decoded user to `request.user`

### GraphQL Auth Guard (`src/auth/gql-auth.guard.ts`)
- Custom guard for protecting GraphQL queries/mutations
- Use `@UseGuards(GqlAuthGuard)` on resolvers requiring auth
- Passes decoded JWT user via GraphQL context

### OAuth Strategies
- **GoogleStrategy** (`google.strategy.ts`) — Redirect users to `/auth/google`, callback at `localhost:4000/auth/google/callback`
- **AppleStrategy** (`apple.strategy.ts`) — OPTIONAL, only active if `APPLE_*` env vars are set (graceful degradation if missing)

**Key Security Detail:** Apple only sends email on first login; subsequent logins use `socialId` for identification.

## Testing & Test Coverage

Tests are co-located with source files (`.service.spec.ts`). Configuration in `jest.config.js` (check for coverage thresholds).

**Test Strategy:**
- Unit tests for services and guards
- Integration tests use real or seeded database (not mocks)
- Run `pnpm test:cov` to verify coverage against thresholds

**Common Test Patterns:**
```typescript
// Service test example
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();
    service = module.get(UsersService);
    prisma = module.get(PrismaService);
  });

  it('should create a user', async () => {
    const user = await service.createUser({ email: 'test@example.com', ... });
    expect(user).toBeDefined();
  });
});
```

## Key Integration Points

### Cloudinary (`src/integrations/cloudinary.service.ts`)
- Uploads avatars and images
- Used by `uploadAvatar` mutation in UsersResolver
- Requires `CLOUDINARY_URL` env var

### AWS S3 (`src/integrations/s3.service.ts`)
- Skeleton implementation for S3 file uploads
- Requires `AWS_S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### Stripe (`src/payments/`)
- Payment intent creation via `createPaymentIntent` mutation
- Requires `STRIPE_SECRET_KEY` env var

### WebSocket/Socket.IO (`src/notifications/notifications.gateway.ts`)
- Real-time notifications on new club invitations
- Users join rooms named `user_${userId}` via socket connection
- Broker pattern: resolvers emit events to gateway

### Search Service (`src/search/search.service.ts`)
- Skeleton adapters for Algolia and ElasticSearch
- Implement `searchUsers()` and `searchClubs()` as needed

## Environment Variables

All env vars are defined in `.env.example`. Key variables:

```
DATABASE_URL                    # PostgreSQL connection string
JWT_SECRET, JWT_EXPIRES_IN      # Token signing and expiry
FRONTEND_URL                    # CORS origin for frontend
GOOGLE_CLIENT_ID, ...           # Google OAuth credentials
APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY  # Apple Sign In
CLOUDINARY_URL                  # Image upload provider
AWS_S3_BUCKET, AWS_REGION, ...  # S3 credentials
STRIPE_SECRET_KEY               # Stripe API key
ELASTICSEARCH_NODE, ALGOLIA_*   # Search backends (optional)
NODE_ENV                        # development or production
```

## Error Handling & Validation

### Global Exception Filter
The `AllExceptionsFilter` in `src/common/filters/all-exceptions.filter.ts` intercepts all exceptions and sanitizes responses. **Importantly**, it masks Prisma/database errors to prevent SQL schema leaks.

### Validation Pipe
All endpoints automatically validate DTOs via `class-validator`. The pipe:
- Whitelist properties (rejects unknown fields)
- Forbids non-whitelisted properties (strict mode)
- Auto-transforms payload to DTO class

### GraphQL Error Formatting
Errors are formatted in `graphql.module.ts`:
- Prisma errors → masked as "Internal server error"
- Validation errors → array of field-level errors
- Auth errors → code 401 with "UNAUTHENTICATED" extension

## Development Workflow

### Adding a New Feature Module

1. **Generate the module structure:**
   ```bash
   nest generate module features/my-feature
   nest generate service features/my-feature
   nest generate resolver features/my-feature
   ```

2. **Update Prisma schema** (`prisma/schema.prisma`) with new models/relations

3. **Generate Prisma client:**
   ```bash
   pnpm prisma:generate
   ```

4. **Create a migration** (if schema changed):
   ```bash
   pnpm prisma:migrate --name add_my_feature
   ```

5. **Implement service methods** with Prisma queries and business logic

6. **Implement resolver** methods that call the service

7. **Add unit tests** in `.service.spec.ts` with Jest

8. **Import the module** into `app.module.ts`

### Debugging

- **GraphQL Playground:** http://localhost:4000/graphql — test queries/mutations interactively
- **Console logs:** Review server output for debug statements and errors
- **Database:** Connect directly via `psql` or a client like DBeaver
- **Test with watch:** `pnpm test:watch src/my-feature/my-feature.service.spec.ts`

## Performance & Scaling Considerations

- **Query Depth Limiting:** Apollo is configured to reject queries deeper than 5 levels (prevent DoS)
- **Throttling:** 100 requests per minute per IP (configurable in app.module.ts)
- **Database Indexes:** Multiple indexes on User (role, position, country, city combos) for talent search
- **Pagination:** Resolvers should implement cursor-based pagination for large result sets (not yet standardized)
- **N+1 Queries:** Be cautious with `@ResolveField` — each call may fetch related data; consider Prisma includes or batching

## Common Pitfalls

1. **Forgetting to export a service** from its module — other modules can't inject it
2. **Missing Prisma index on frequently queried fields** — talent search will be slow
3. **Exposing Prisma/SQL errors in GraphQL responses** — already prevented by the error filter, but avoid throwing raw errors
4. **Not validating OAuth provider fields** — always check `authProvider` and `socialId` exist before assuming password
5. **Blocking operations in resolvers** — use services for async work; resolvers should be thin
6. **Forgetting to await Prisma calls** — they are promises; missing await causes unhandled rejections
