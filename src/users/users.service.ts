import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    username: string;
    password?: string;
  }) {
    const hashed = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;
    return this.prisma.user.create({
      data: { email: data.email, username: data.username, password: hashed },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setAvatar(userId: string, url: string) {
    await this.prisma.profile.upsert({
      where: { userId },
      update: { avatarUrl: url },
      create: { userId, avatarUrl: url },
    });
    return this.findById(userId);
  }
}
