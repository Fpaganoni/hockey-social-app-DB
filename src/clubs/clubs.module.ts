import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { PrismaService } from '../prisma.service';
import { ClubsResolver } from './clubs.resolver';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [ClubsService, PrismaService, ClubsResolver],
  exports: [ClubsService],
})
export class ClubsModule {}
