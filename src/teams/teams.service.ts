import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async createTeam(data: { name: string; category: string; clubId: string }) {
    return this.prisma.team.create({ data });
  }

  async listByClub(clubId: string) {
    return this.prisma.team.findMany({ where: { clubId } });
  }
}
