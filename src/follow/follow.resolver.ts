import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { FollowService } from "./follow.service";

@Resolver("Follow")
export class FollowResolver {
  constructor(private followService: FollowService) {}

  @Mutation(() => Object)
  async follow(
    @Args("followerType") followerType: string,
    @Args("followerId") followerId: string,
    @Args("followingType") followingType: string,
    @Args("followingId") followingId: string
  ) {
    return this.followService.follow(
      followerType as "USER" | "CLUB",
      followerId,
      followingType as "USER" | "CLUB",
      followingId
    );
  }

  @Mutation(() => Boolean)
  async unfollow(
    @Args("followerType") followerType: string,
    @Args("followerId") followerId: string,
    @Args("followingType") followingType: string,
    @Args("followingId") followingId: string
  ) {
    return this.followService.unfollow(
      followerType as "USER" | "CLUB",
      followerId,
      followingType as "USER" | "CLUB",
      followingId
    );
  }

  @Query(() => [Object])
  async followers(
    @Args("entityType") entityType: string,
    @Args("entityId") entityId: string
  ) {
    return this.followService.getFollowers(
      entityType as "USER" | "CLUB",
      entityId
    );
  }

  @Query(() => [Object])
  async following(
    @Args("entityType") entityType: string,
    @Args("entityId") entityId: string
  ) {
    return this.followService.getFollowing(
      entityType as "USER" | "CLUB",
      entityId
    );
  }

  @Query(() => Number)
  async followersCount(
    @Args("entityType") entityType: string,
    @Args("entityId") entityId: string
  ) {
    return this.followService.getFollowersCount(
      entityType as "USER" | "CLUB",
      entityId
    );
  }

  @Query(() => Number)
  async followingCount(
    @Args("entityType") entityType: string,
    @Args("entityId") entityId: string
  ) {
    return this.followService.getFollowingCount(
      entityType as "USER" | "CLUB",
      entityId
    );
  }
}
