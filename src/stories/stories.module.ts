import { Module } from "@nestjs/common";
import { StoriesService } from "./stories.service";
import { StoriesResolver } from "./stories.resolver";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [StoriesService, StoriesResolver, PrismaService],
  exports: [StoriesService],
})
export class StoriesModule {}
