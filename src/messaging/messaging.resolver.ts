import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { MessagingService } from "./messaging.service";

@Resolver("Conversation")
export class MessagingResolver {
  constructor(private messagingService: MessagingService) {}

  @Query(() => [Object])
  async myConversations(@Args("userId") userId: string) {
    return this.messagingService.getConversations(userId);
  }

  @Query(() => Object, { nullable: true })
  async conversation(@Args("id") id: string) {
    return this.messagingService.getConversation(id);
  }

  @Query(() => [Object])
  async messages(@Args("conversationId") conversationId: string) {
    return this.messagingService.getMessages(conversationId);
  }

  @Mutation(() => Object)
  async startConversation(
    @Args({ name: "participantIds", type: () => [String] })
    participantIds: string[]
  ) {
    return this.messagingService.startConversation(participantIds);
  }

  @Mutation(() => Object)
  async sendMessage(
    @Args("conversationId") conversationId: string,
    @Args("senderId") senderId: string,
    @Args("content") content: string
  ) {
    return this.messagingService.sendMessage(conversationId, senderId, content);
  }

  @Mutation(() => Boolean)
  async markMessageAsRead(@Args("messageId") messageId: string) {
    return this.messagingService.markAsRead(messageId);
  }
}
