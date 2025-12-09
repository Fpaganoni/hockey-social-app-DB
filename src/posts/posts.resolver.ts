import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { PostsService } from "./posts.service";

@Resolver("Post")
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query(() => [Object])
  async posts(
    @Args("limit", { nullable: true }) limit?: number,
    @Args("offset", { nullable: true }) offset?: number
  ) {
    return this.postsService.findAll(limit, offset);
  }

  @Query(() => Object, { nullable: true })
  async post(@Args("id") id: string) {
    return this.postsService.findById(id);
  }

  @Query(() => [Object])
  async postsByUser(@Args("userId") userId: string) {
    return this.postsService.findByUser(userId);
  }

  @Query(() => [Object])
  async postsByClub(@Args("clubId") clubId: string) {
    return this.postsService.findByClub(clubId);
  }

  @Mutation(() => Object)
  async createPost(
    @Args("content") content: string,
    @Args("userId") userId: string,
    @Args("clubId", { nullable: true }) clubId?: string,
    @Args("imageUrl", { nullable: true }) imageUrl?: string,
    @Args({ name: "images", type: () => [String], nullable: true })
    images?: string[],
    @Args("videoUrl", { nullable: true }) videoUrl?: string,
    @Args("visibility", { nullable: true }) visibility?: string,
    @Args("isPinned", { nullable: true }) isPinned?: boolean
  ) {
    return this.postsService.create({
      content,
      userId,
      clubId,
      imageUrl,
      images,
      videoUrl,
      visibility: visibility as "PUBLIC" | "FRIENDS" | "PRIVATE",
      isPinned,
    });
  }

  @Mutation(() => Object)
  async updatePost(
    @Args("id") id: string,
    @Args("content", { nullable: true }) content?: string,
    @Args("imageUrl", { nullable: true }) imageUrl?: string,
    @Args({ name: "images", type: () => [String], nullable: true })
    images?: string[],
    @Args("videoUrl", { nullable: true }) videoUrl?: string,
    @Args("visibility", { nullable: true }) visibility?: string,
    @Args("isPinned", { nullable: true }) isPinned?: boolean
  ) {
    return this.postsService.update(id, {
      content,
      imageUrl,
      images,
      videoUrl,
      visibility: visibility as "PUBLIC" | "FRIENDS" | "PRIVATE",
      isPinned,
    });
  }

  @Mutation(() => Boolean)
  async deletePost(@Args("id") id: string) {
    return this.postsService.delete(id);
  }

  // Comments
  @Query(() => [Object])
  async comments(@Args("postId") postId: string) {
    return this.postsService.getComments(postId);
  }

  @Mutation(() => Object)
  async createComment(
    @Args("postId") postId: string,
    @Args("userId") userId: string,
    @Args("content") content: string,
    @Args("parentCommentId", { nullable: true }) parentCommentId?: string
  ) {
    return this.postsService.createComment(
      postId,
      userId,
      content,
      parentCommentId
    );
  }

  @Mutation(() => Boolean)
  async deleteComment(@Args("id") id: string) {
    return this.postsService.deleteComment(id);
  }

  // Likes
  @Mutation(() => Object)
  async likePost(
    @Args("postId") postId: string,
    @Args("userId") userId: string
  ) {
    return this.postsService.likePost(postId, userId);
  }

  @Mutation(() => Boolean)
  async unlikePost(
    @Args("postId") postId: string,
    @Args("userId") userId: string
  ) {
    return this.postsService.unlikePost(postId, userId);
  }

  // Field resolvers
  @ResolveField("comments")
  async commentsField(@Parent() post: any) {
    return this.postsService.getComments(post.id);
  }

  @ResolveField("likes")
  async likes(@Parent() post: any) {
    return this.postsService.getLikes(post.id);
  }

  @ResolveField("likesCount")
  async likesCount(@Parent() post: any) {
    return this.postsService.getLikesCount(post.id);
  }
}
