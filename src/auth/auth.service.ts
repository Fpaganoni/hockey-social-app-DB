import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) return user;
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async oauthLogin(profile: { email: string; displayName?: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (!user) {
      // Generar username único basado en el email
      let baseUsername = profile.email.split("@")[0];
      let username = baseUsername;
      let counter = 1;

      // Si el username ya existe, agregar un sufijo numérico
      while (await this.prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          username,
          profile: profile.displayName
            ? { create: { displayName: profile.displayName } }
            : undefined,
        },
      });
    }
    return this.login(user);
  }
}
