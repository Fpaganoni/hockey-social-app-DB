import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { StoriesService } from "./stories.service";

@Resolver("Story")
export class StoriesResolver {
  constructor(private storiesService: StoriesService) {}

  // Get active stories from users the current user follows
  @Query(() => [Object])
  async activeStories(@Args("userId") userId: string) {
    return this.storiesService.getActiveStoriesFromFollowing(userId);
  }

  // Get all active stories from a specific user
  @Query(() => [Object])
  async userStories(@Args("userId") userId: string) {
    return this.storiesService.getUserStories(userId);
  }

  // Get viewers of a specific story
  @Query(() => [Object])
  async storyViewers(@Args("storyId") storyId: string) {
    return this.storiesService.getStoryViewers(storyId);
  }

  // Create a new story
  @Mutation(() => Object)
  async createStory(
    @Args("userId") userId: string,
    @Args("imageUrl", { nullable: true }) imageUrl?: string,
    @Args("videoUrl", { nullable: true }) videoUrl?: string,
    @Args("text", { nullable: true }) text?: string,
  ) {
    return this.storiesService.createStory({
      userId,
      imageUrl,
      videoUrl,
      text,
    });
  }

  // Mark a story as viewed
  @Mutation(() => Object)
  async viewStory(
    @Args("storyId") storyId: string,
    @Args("userId") userId: string,
  ) {
    return this.storiesService.viewStory(storyId, userId);
  }

  // Delete a story
  @Mutation(() => Boolean)
  async deleteStory(@Args("id") id: string) {
    return this.storiesService.deleteStory(id);
  }

  // Field resolver for views count
  @ResolveField("viewsCount")
  async viewsCount(@Parent() story: any) {
    return this.storiesService.getViewsCount(story.id);
  }

  // Field resolver to check if a user has viewed the story
  @ResolveField("isViewed")
  async isViewed(
    @Parent() story: any,
    @Args("userId") userId: string,
  ): Promise<boolean> {
    return this.storiesService.hasUserViewedStory(story.id, userId);
  }
}
