import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ProfileLikesService } from "./profile-likes.service";

@Resolver("ProfileLike")
export class ProfileLikesResolver {
  constructor(private profileLikesService: ProfileLikesService) {}

  @Mutation(() => Object)
  async likeProfile(
    @Args("likerType") likerType: string,
    @Args("likerId") likerId: string,
    @Args("profileType") profileType: string,
    @Args("profileId") profileId: string,
  ) {
    return this.profileLikesService.likeProfile(
      likerType as "USER" | "CLUB",
      likerId,
      profileType as "USER" | "CLUB",
      profileId,
    );
  }

  @Mutation(() => Boolean)
  async unlikeProfile(
    @Args("likerType") likerType: string,
    @Args("likerId") likerId: string,
    @Args("profileType") profileType: string,
    @Args("profileId") profileId: string,
  ) {
    return this.profileLikesService.unlikeProfile(
      likerType as "USER" | "CLUB",
      likerId,
      profileType as "USER" | "CLUB",
      profileId,
    );
  }

  @Query(() => [Object])
  async profileLikes(
    @Args("profileType") profileType: string,
    @Args("profileId") profileId: string,
  ) {
    return this.profileLikesService.getProfileLikes(
      profileType as "USER" | "CLUB",
      profileId,
    );
  }

  @Query(() => Number)
  async profileLikesCount(
    @Args("profileType") profileType: string,
    @Args("profileId") profileId: string,
  ) {
    return this.profileLikesService.getProfileLikesCount(
      profileType as "USER" | "CLUB",
      profileId,
    );
  }

  @Query(() => Boolean)
  async hasLikedProfile(
    @Args("likerType") likerType: string,
    @Args("likerId") likerId: string,
    @Args("profileType") profileType: string,
    @Args("profileId") profileId: string,
  ) {
    return this.profileLikesService.hasLiked(
      likerType as "USER" | "CLUB",
      likerId,
      profileType as "USER" | "CLUB",
      profileId,
    );
  }

  @Query(() => [Object])
  async likedProfiles(
    @Args("likerType") likerType: string,
    @Args("likerId") likerId: string,
  ) {
    return this.profileLikesService.getLikedProfiles(
      likerType as "USER" | "CLUB",
      likerId,
    );
  }
}
