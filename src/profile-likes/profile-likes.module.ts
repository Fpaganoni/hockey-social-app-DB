import { Module } from "@nestjs/common";
import { ProfileLikesService } from "./profile-likes.service";
import { ProfileLikesResolver } from "./profile-likes.resolver";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [ProfileLikesService, ProfileLikesResolver, PrismaService],
  exports: [ProfileLikesService],
})
export class ProfileLikesModule {}
