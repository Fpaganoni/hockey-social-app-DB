import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.club.findMany({ include: { teams: true } });
  }

  create(data: { name: string; location?: string }) {
    return this.prisma.club.create({ data });
  }

  async inviteMember(clubId: string, userId: string, invitedBy: string) {
    return this.prisma.clubMember.create({ data: { clubId, userId, invitedBy, status: 'PENDING' } });
  }

  async acceptMembership(membershipId: string) {
    return this.prisma.clubMember.update({ where: { id: membershipId }, data: { status: 'ACTIVE' } });
  }
}
