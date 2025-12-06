import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClubsModule } from './clubs/clubs.module';
import { TeamsModule } from './teams/teams.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [GraphqlModule, AuthModule, UsersModule, ClubsModule, TeamsModule, MarketplaceModule, NotificationsModule, SearchModule, PaymentsModule],
  providers: [PrismaService],
})
export class AppModule {}
