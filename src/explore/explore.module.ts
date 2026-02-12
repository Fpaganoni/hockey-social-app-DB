import { Module } from "@nestjs/common";
import { ExploreService } from "./explore.service";
import { ExploreResolver } from "./explore.resolver";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [ExploreService, ExploreResolver, PrismaService],
  exports: [ExploreService],
})
export class ExploreModule {}
