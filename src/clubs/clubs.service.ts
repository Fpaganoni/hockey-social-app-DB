import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.club.findMany({ include: { teams: true } });
  }

  create(data: { name: string; location?: string }) {
    return this.prisma.club.create({ data });
  }

  async inviteMember(clubId: string, userId: string, invitedById: string) {
    // Verificar que el usuario no sea ya miembro
    const existing = await this.prisma.clubMember.findFirst({
      where: { clubId, userId },
    });

    if (existing) {
      throw new Error("User is already a member of this club");
    }

    return this.prisma.clubMember.create({
      data: { clubId, userId, invitedById, status: "PENDING" },
    });
  }

  async acceptMembership(membershipId: string) {
    return this.prisma.clubMember.update({
      where: { id: membershipId },
      data: { status: "ACTIVE" },
    });
  }
}
