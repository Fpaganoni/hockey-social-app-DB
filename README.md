# NestJS + GraphQL + Prisma Boilerplate (Postgres) — Extended

Includes:
- NestJS + GraphQL (Apollo)
- Prisma + PostgreSQL
- Auth (JWT) with hooks for OAuth
- Cloudinary + AWS S3 integration placeholders
- WebSocket notifications (Socket.IO Gateway)
- Search module (ElasticSearch + Algolia placeholders)
- Payments (Stripe)
- pnpm as package manager (package.json set accordingly)

Quick start:
1. Copy `.env.example` to `.env` and fill values.
2. Install with pnpm: `pnpm install`
3. Generate Prisma client: `pnpm prisma:generate` (or `npx prisma generate`)
4. Run migrations: `pnpm prisma:migrate`
5. Start dev server: `pnpm start:dev`
6. Open GraphQL playground: http://localhost:3000/graphql

Notes:
- The project contains skeleton services for Cloudinary, S3, search and Stripe. Fill env vars and adapt logic as needed.
- WebSocket gateway uses Socket.IO and allows clients to join rooms with their userId.
- Algolia/Elastic are both supported as adapters in search service.

## Implemented features (added)
- GraphQL resolvers for Users (register/login/uploadAvatar), Teams, Clubs (invite -> notification), Marketplace (services) and Payments (createPaymentIntent).
- Google OAuth strategy + /auth/google endpoints.
- Cloudinary avatar upload mutation.
- Notifications gateway example: club invite sends real-time notification to user room (userId).
