import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";
import { MessagingResolver } from "./messaging.resolver";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [MessagingService, MessagingResolver, PrismaService],
  exports: [MessagingService],
})
export class MessagingModule {}
