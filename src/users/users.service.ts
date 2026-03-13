import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    name: string; // REQUIRED
    username?: string;
    password?: string;
    role?: string;
  }) {
    const hashed = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        username: data.username,
        password: hashed,
        role: data.role as any,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setAvatar(userId: string, url: string) {
    // Update directly on User now (no more Profile table)
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: url },
    });
  }

  async setCoverImage(userId: string, url: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { coverImage: url },
    });
  }

  async setCv(userId: string, url: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { cvUrl: url },
    });
  }

  async deleteCv(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { cvUrl: null },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role: role as any },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      bio?: string;
      avatar?: string;
      coverImage?: string;
      position?: string;
      country?: string;
      city?: string;
      clubId?: string;
      yearsOfExperience?: number;
      cvUrl?: string;
      multimedia?: string[];
      statistics?: any;
    },
  ) {
    const { statistics, ...userUpdateData } = data;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userUpdateData,
    });

    if (statistics) {
      const careerStats = await this.prisma.statistics.findFirst({
        where: { userId: id, season: "Career" },
      });

      if (careerStats) {
        await this.prisma.statistics.update({
          where: { id: careerStats.id },
          data: statistics,
        });
      } else {
        await this.prisma.statistics.create({
          data: {
            ...statistics,
            userId: id,
            season: "Career",
          },
        });
      }
    }

    return updatedUser;
  }
}
