import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../prisma.service";
import { GoogleStrategy } from "./google.strategy";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
