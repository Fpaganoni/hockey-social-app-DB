import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ProfileLikesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Give a like to a profile
   */
  async likeProfile(
    likerType: "USER" | "CLUB",
    likerId: string,
    profileType: "USER" | "CLUB",
    profileId: string,
  ) {
    try {
      return await this.prisma.profileLike.create({
        data: {
          likerType,
          likerId,
          profileType,
          profileId,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("Already liked this profile");
      }
      throw error;
    }
  }

  /**
   * Remove a like from a profile
   */
  async unlikeProfile(
    likerType: "USER" | "CLUB",
    likerId: string,
    profileType: "USER" | "CLUB",
    profileId: string,
  ) {
    const profileLike = await this.prisma.profileLike.findFirst({
      where: {
        likerType,
        likerId,
        profileType,
        profileId,
      },
    });

    if (!profileLike) {
      throw new Error("Like not found");
    }

    await this.prisma.profileLike.delete({
      where: { id: profileLike.id },
    });

    return true;
  }

  /**
   * Get all likes for a profile (who liked this profile)
   */
  async getProfileLikes(profileType: "USER" | "CLUB", profileId: string) {
    return this.prisma.profileLike.findMany({
      where: {
        profileType,
        profileId,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Count likes for a profile
   */
  async getProfileLikesCount(profileType: "USER" | "CLUB", profileId: string) {
    return this.prisma.profileLike.count({
      where: {
        profileType,
        profileId,
      },
    });
  }

  /**
   * Check if a user/club has liked a profile
   */
  async hasLiked(
    likerType: "USER" | "CLUB",
    likerId: string,
    profileType: "USER" | "CLUB",
    profileId: string,
  ) {
    const like = await this.prisma.profileLike.findFirst({
      where: {
        likerType,
        likerId,
        profileType,
        profileId,
      },
    });

    return !!like;
  }

  /**
   * Get profiles that a user/club has liked
   */
  async getLikedProfiles(likerType: "USER" | "CLUB", likerId: string) {
    return this.prisma.profileLike.findMany({
      where: {
        likerType,
        likerId,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
