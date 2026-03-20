🏒 Hockey Connect - Technical Roadmap
This roadmap outlines the technical progress of the Hockey Connect project, detailing what has been implemented so far and what remains to be developed based on the current architecture (NestJS + GraphQL + Prisma) and database schema.

✅ Phase 1: Foundation & Core Architecture (Completed)
The core infrastructure and database schema have been established to support a scalable social network for hockey players and clubs.

Backend Framework: NestJS with GraphQL (Apollo)
Database: PostgreSQL with Prisma ORM
Authentication: JWT-based Auth with OAuth support (Google, Apple)
Data Modeling: Comprehensive Prisma schema defining relationships between Users, Clubs, Teams, Members, Posts, and more.
🚀 Phase 2: Core Features Implementation (Completed)
The fundamental modules required for the application to function have been created. Many of these have corresponding GraphQL resolvers and services.

👤 User & Identity Management
User Registration, Login, and Email Verification.
Profile management (Avatar, Cover Image, Bio, CV).
Role-based access control (PLAYER, COACH, CLUB_ADMIN, SUPERADMIN).
Authentication logic (auth and users modules).
🛡️ Club & Team Management
Club creation and profile management.
Team creation within clubs.
Club logic: Inviting players, accepting memberships, role assignment (MEMBER, CAPTAIN, COACH).
Managed via clubs and teams modules.
📱 Social Feed & Engagement
Posts: Creating text, image, and video posts. Public/Private visibility.
Engagement: Liking and commenting on posts. Nested comments (replies).
Following: User-to-User and User-to-Club follow system (follow module).
Stories: 24-hour expiring stories and view tracking (stories module).
Profile Likes: Ability to "like" or endorse profiles (profile-likes module).
💬 Messaging & Notifications
Real-time WebSocket Gateway implementation using Socket.IO.
Direct messages and Group conversations (messaging module).
Notification system for invites and interactions (notifications module).
💼 Professional Network (Jobs & Trajectories)
Job Opportunities board (creation, filtering).
Job Applications tracking.
Player/Coach Career Trajectories and Statistics tracking (jobs module).
☁️ Infrastructure Integrations (Basic Setup)
File Uploads setup (uploads module) using Cloudinary / AWS S3 (placeholders implemented).
Search adapter foundations (search module) for Elasticsearch/Algolia.
Payments foundations (payments module) using Stripe.
🚧 Phase 3: Advanced Integrations & Refinement (To Do / In Progress)
These features have skeletal implementations or database models but require further logic, third-party integration, or frontend connection.

🔍 Advanced Search Automation:

Fully integrate Algolia or Elasticsearch to automatically index Users, Clubs, and Job Opportunities upon creation/update.
Implement full-text search resolvers in the explore and search modules.
💳 Payment Processing (Stripe):

Finalize Stripe webhooks to handle subscription statuses for Premium features.
Connect the Marketplace / Services concepts to actual payment flows.
Handle payouts or escrow if the platform takes a fee.
🖼️ Automated Media Processing:

Enhance the uploads module to automatically transcode videos for stories and feed posts using AWS MediaConvert or Cloudinary's video API.
Implement secure, signed URLs for private CV/Resume downloads.
📊 Analytics & Statistics Engine:

Develop algorithms in the statistics module to compute leaderboards and aggregate data across leagues/teams.
🔮 Phase 4: Future Enhancements (Backlog)
Features planned for future iterations to expand the platform's value.

Push Notifications: Integrate Firebase Cloud Messaging (FCM) or Apple Push Notification service (APNs) for mobile app alerts.
Match & Tournament Management: Tools for clubs to organize matches, track live scores, and manage tournament brackets.
AI Matchmaking: Use AI to suggest players to clubs based on their statistics, position, and location.
Localization & Internationalization (i18n): Support for multiple languages in emails and notifications.
