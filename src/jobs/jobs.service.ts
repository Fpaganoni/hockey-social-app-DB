import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    positionType?: string;
    country?: string;
    city?: string;
    status?: string;
  }) {
    return this.prisma.jobOpportunity.findMany({
      where: {
        positionType: filters?.positionType as any,
        country: filters?.country,
        city: filters?.city,
        status: filters?.status as any,
      },
      include: {
        club: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.jobOpportunity.findUnique({
      where: { id },
      include: {
        club: true,
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    positionType: string;
    clubId: string;
    country: string;
    city: string;
    salary?: number;
    currency?: string;
    benefits?: string;
  }) {
    return this.prisma.jobOpportunity.create({
      data: {
        ...data,
        positionType: data.positionType as any,
        currency: data.currency as any,
      },
      include: {
        club: true,
      },
    });
  }

  async update(id: string, data: { status?: string }) {
    return this.prisma.jobOpportunity.update({
      where: { id },
      data: {
        status: data.status as any,
      },
      include: {
        club: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.jobOpportunity.delete({ where: { id } });
    return true;
  }
}
