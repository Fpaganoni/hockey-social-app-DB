import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

/**
 * AuthService — handles all authentication logic:
 *  - Email/password login (validateUser + login)
 *  - OAuth login for Google and Apple (oauthLogin)
 *
 * SECURITY NOTES:
 *  - OAuth users have password = null. Never try to bcrypt.compare against null.
 *  - Always identify OAuth users first by (authProvider + socialId), then fall
 *    back to email to link pre-existing email/password accounts.
 *  - Apple only sends email on the FIRST login. socialId (Apple's `sub`) is the
 *    only reliable key for all subsequent Apple logins.
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Validates an email/password pair.
   * Returns the user if credentials match, or null if not.
   * SECURITY: Returns null (not throws) to avoid leaking whether email exists.
   */
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Guard: OAuth users have no password — reject plaintext login attempts.
    if (!user || !user.password) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) return user;
    return null;
  }

  /**
   * Issues a signed JWT for an authenticated user.
   * Payload includes: sub (user ID), username, role.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Handles OAuth login for Google and Apple.
   *
   * Flow:
   *  1. Look up user by (authProvider + socialId) → fastest path for returning users.
   *  2. If not found, look up by email → link OAuth provider to an existing email account.
   *  3. If still not found, create a new user (password = null, authProvider set).
   *
   * @param profile.email      Email from the provider (may be undefined for Apple after 1st login)
   * @param profile.displayName Human-readable name from the provider
   * @param profile.provider   'GOOGLE' | 'APPLE'
   * @param profile.socialId   The provider's unique user ID (Google: profile.id, Apple: idToken.sub)
   */
  async oauthLogin(profile: {
    email?: string;
    displayName?: string;
    provider: "GOOGLE" | "APPLE";
    socialId: string;
  }) {
    // Step 1: Look up by socialId + provider (handles all returning Apple users too)
    let user = await this.prisma.user.findFirst({
      where: {
        authProvider: profile.provider,
        socialId: profile.socialId,
      },
    });

    if (user) return this.login(user);

    // Step 2: Look up by email to link existing email/password account
    if (profile.email) {
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        // Link OAuth provider to existing account
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            authProvider: profile.provider,
            socialId: profile.socialId,
          },
        });
        return this.login(user);
      }
    }

    // Step 3: No existing user — require email to register (Apple may omit it after 1st login)
    if (!profile.email) {
      throw new UnauthorizedException(
        "Unable to authenticate: email is required to create a new account. " +
          "Please ensure you share your email when signing in with Apple.",
      );
    }

    // Generate a unique username from the email prefix
    const baseUsername = profile.email.split("@")[0];
    let username = baseUsername;
    let counter = 1;
    while (await this.prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    user = await this.prisma.user.create({
      data: {
        email: profile.email,
        username,
        name: profile.displayName || username,
        password: null, // OAuth users never have a password
        authProvider: profile.provider,
        socialId: profile.socialId,
      },
    });

    return this.login(user);
  }
}
