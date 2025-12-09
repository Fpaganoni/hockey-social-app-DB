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

  // Job Applications
  async applyForJob(data: {
    jobOpportunityId: string;
    userId: string;
    coverLetter?: string;
    resumeUrl?: string;
  }) {
    try {
      return await this.prisma.jobApplication.create({
        data: {
          jobOpportunityId: data.jobOpportunityId,
          userId: data.userId,
          coverLetter: data.coverLetter,
          resumeUrl: data.resumeUrl,
        },
        include: {
          user: true,
          jobOpportunity: {
            include: {
              club: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("You have already applied for this job");
      }
      throw error;
    }
  }

  async getApplications(jobOpportunityId: string, status?: string) {
    return this.prisma.jobApplication.findMany({
      where: {
        jobOpportunityId,
        status: status as any,
      },
      include: {
        user: true,
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async getUserApplications(userId: string, status?: string) {
    return this.prisma.jobApplication.findMany({
      where: {
        userId,
        status: status as any,
      },
      include: {
        jobOpportunity: {
          include: {
            club: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async getApplicationById(id: string) {
    return this.prisma.jobApplication.findUnique({
      where: { id },
      include: {
        user: true,
        jobOpportunity: {
          include: {
            club: true,
          },
        },
      },
    });
  }

  async updateApplicationStatus(
    id: string,
    status: string,
    reviewedBy?: string,
    notes?: string
  ) {
    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        reviewedBy,
        notes,
      },
      include: {
        user: true,
        jobOpportunity: true,
      },
    });
  }

  async withdrawApplication(id: string, userId: string) {
    const application = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!application) {
      throw new Error("Application not found or not authorized");
    }

    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        status: "WITHDRAWN",
      },
    });
  }
}
