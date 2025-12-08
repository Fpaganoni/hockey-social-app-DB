import { Module } from "@nestjs/common";
import { GraphqlModule } from "./graphql.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ClubsModule } from "./clubs/clubs.module";
import { TeamsModule } from "./teams/teams.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SearchModule } from "./search/search.module";
import { PaymentsModule } from "./payments/payments.module";
import { PostsModule } from "./posts/posts.module";
import { FollowModule } from "./follow/follow.module";
import { JobsModule } from "./jobs/jobs.module";
import { MessagingModule } from "./messaging/messaging.module";

@Module({
  imports: [
    GraphqlModule,
    AuthModule,
    UsersModule,
    ClubsModule,
    TeamsModule,
    NotificationsModule,
    SearchModule,
    PaymentsModule,
    PostsModule,
    FollowModule,
    JobsModule,
    MessagingModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
