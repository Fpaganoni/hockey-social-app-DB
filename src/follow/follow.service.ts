import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async follow(
    followerType: "USER" | "CLUB",
    followerId: string,
    followingType: "USER" | "CLUB",
    followingId: string
  ) {
    try {
      return await this.prisma.follow.create({
        data: {
          followerType,
          followerId,
          followingType,
          followingId,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("Already following");
      }
      throw error;
    }
  }

  async unfollow(
    followerType: "USER" | "CLUB",
    followerId: string,
    followingType: "USER" | "CLUB",
    followingId: string
  ) {
    const follow = await this.prisma.follow.findFirst({
      where: {
        followerType,
        followerId,
        followingType,
        followingId,
      },
    });

    if (!follow) {
      throw new Error("Not following");
    }

    await this.prisma.follow.delete({
      where: { id: follow.id },
    });

    return true;
  }

  async getFollowers(entityType: "USER" | "CLUB", entityId: string) {
    return this.prisma.follow.findMany({
      where: {
        followingType: entityType,
        followingId: entityId,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getFollowing(entityType: "USER" | "CLUB", entityId: string) {
    return this.prisma.follow.findMany({
      where: {
        followerType: entityType,
        followerId: entityId,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getFollowersCount(entityType: "USER" | "CLUB", entityId: string) {
    return this.prisma.follow.count({
      where: {
        followingType: entityType,
        followingId: entityId,
      },
    });
  }

  async getFollowingCount(entityType: "USER" | "CLUB", entityId: string) {
    return this.prisma.follow.count({
      where: {
        followerType: entityType,
        followerId: entityId,
      },
    });
  }
}
