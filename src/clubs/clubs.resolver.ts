import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ClubsService } from "./clubs.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";

@Resolver("Club")
export class ClubsResolver {
  constructor(
    private clubsService: ClubsService,
    private notifications: NotificationsGateway
  ) {}

  @Query()
  clubs() {
    return this.clubsService.findAll();
  }

  /** Returns a flat view of every club paired with its CLUB_ADMIN user. */
  @Query()
  clubAdmins() {
    return this.clubsService.getClubAdmins();
  }

  @Mutation()
  async createClub(
    @Args("name") name: string,
    @Args("city") city: string,
    @Args("country") country: string,
    @Args("adminId") adminId: string,
    @Args("location", { nullable: true }) location?: string,
    @Args("benefits", { type: () => [String], nullable: true }) benefits?: string[]
  ) {
    return this.clubsService.create({ name, city, country, adminId, location, benefits });
  }

  @Mutation()
  async invitePlayerToClub(
    @Args("clubId") clubId: string,
    @Args("userId") userId: string,
    @Args("invitedBy") invitedBy: string
  ) {
    const membership = await this.clubsService.inviteMember(
      clubId,
      userId,
      invitedBy
    );
    this.notifications.sendNotification(userId, {
      type: "INVITE",
      clubId,
      membershipId: membership.id,
      message: `You were invited to join club ${clubId}`,
    });
    return membership;
  }

  @Mutation()
  acceptMembership(@Args("membershipId") membershipId: string) {
    return this.clubsService.acceptMembership(membershipId);
  }
}
