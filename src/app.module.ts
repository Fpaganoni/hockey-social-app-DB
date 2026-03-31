import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { GqlThrottlerGuard } from "./common/guards/gql-throttler.guard";
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
import { StoriesModule } from "./stories/stories.module";
import { ProfileLikesModule } from "./profile-likes/profile-likes.module";
import { ExploreModule } from "./explore/explore.module";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds (in milliseconds for latest package)
      limit: 100, // max 100 requests per minute per IP
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/",
    }),
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
    StoriesModule,
    ProfileLikesModule,
    ExploreModule,
    UploadsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
