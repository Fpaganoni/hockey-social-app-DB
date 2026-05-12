import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationsListener } from './notifications.listener';
import { NotificationsResolver } from './notifications.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    NotificationsGateway,
    NotificationsService,
    NotificationsListener,
    NotificationsResolver,
    PrismaService,
  ],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
