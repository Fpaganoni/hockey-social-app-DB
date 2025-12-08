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
    return this.postsService.findByAuthor(userId, "USER");
  }

  @Query(() => [Object])
  async postsByClub(@Args("clubId") clubId: string) {
    return this.postsService.findByAuthor(clubId, "CLUB");
  }

  @Mutation(() => Object)
  async createPost(
    @Args("content") content: string,
    @Args("imageUrl") imageUrl: string,
    @Args("authorType") authorType: string,
    @Args("authorId") authorId: string
  ) {
    return this.postsService.create({
      content,
      imageUrl,
      authorType: authorType as "USER" | "CLUB",
      authorId,
    });
  }

  @Mutation(() => Object)
  async updatePost(
    @Args("id") id: string,
    @Args("content", { nullable: true }) content?: string,
    @Args("imageUrl", { nullable: true }) imageUrl?: string
  ) {
    return this.postsService.update(id, { content, imageUrl });
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
    @Args("authorId") authorId: string,
    @Args("content") content: string
  ) {
    return this.postsService.createComment(postId, authorId, content);
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
  @ResolveField("author")
  async author(@Parent() post: any) {
    return this.postsService.getAuthor(post);
  }

  @ResolveField("clubAuthor")
  async clubAuthor(@Parent() post: any) {
    return this.postsService.getClubAuthor(post);
  }

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
