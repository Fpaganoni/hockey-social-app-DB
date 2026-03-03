import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * AuthController — REST endpoints for OAuth authentication flows.
 *
 * These endpoints are intentionally outside GraphQL because OAuth requires
 * browser redirects (HTTP 302) and POST callbacks, which do not map to
 * GraphQL operations. Once authentication completes, a JWT is issued and
 * the client uses it for all subsequent GraphQL requests.
 *
 * Routes:
 *  GET  /auth/google           — Initiates Google OAuth2 flow (browser redirect)
 *  GET  /auth/google/callback  — Google redirects here after user consents
 *  POST /auth/apple            — Initiates Apple Sign In flow
 *  POST /auth/apple/callback   — Apple POSTs here after user authenticates
 *
 * After successful OAuth, the user is redirected to /oauth-redirect?token=<JWT>
 * The frontend reads the token from the query param and stores it for API calls.
 */
@Controller("auth")
export class AuthController {
  // ─── Google ────────────────────────────────────────────────────────────────

  /**
   * Initiates the Google OAuth2 consent screen.
   * Passport handles the redirect automatically — this handler is intentionally empty.
   */
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Passport redirects to Google — no body needed.
  }

  /**
   * Google OAuth2 callback endpoint.
   * Google redirects here after the user grants (or denies) consent.
   * Passport validates the code, calls GoogleStrategy.validate(), and
   * attaches the JWT result to req.user before reaching this handler.
   */
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const token = (req.user as any)?.access_token ?? null;
    // Redirect to the Next.js frontend OAuth landing page with the JWT.
    // Frontend route: http://localhost:3000/oauth-redirect (app/[locale]/oauth-redirect/page.tsx)
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/oauth-redirect?token=${token}`,
    );
  }

  // ─── Apple ─────────────────────────────────────────────────────────────────

  /**
   * Initiates the Apple Sign In flow.
   * Apple requires a POST request (per Apple's OAuth spec) — unlike Google which uses GET.
   * Passport handles the redirect to Apple's signin page automatically.
   *
   * ⚠️  Apple requires HTTPS for the callback URL. Use ngrok for local development.
   */
  @Post("apple")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("apple"))
  async appleAuth() {
    // Passport redirects to Apple — no body needed.
  }

  /**
   * Apple Sign In callback endpoint.
   * Apple POSTs here (not GET) after authentication, which is why this is a @Post.
   * Passport validates the posted id_token, calls AppleStrategy.validate(), and
   * attaches the JWT result to req.user before reaching this handler.
   *
   * ⚠️  APPLE QUIRK: Apple only includes name and email in the POST body on the
   *     VERY FIRST login. On subsequent logins only the `code` is sent.
   *     AppleStrategy handles this transparently via the stored socialId.
   */
  @Post("apple/callback")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("apple"))
  async appleAuthRedirect(@Req() req: any, @Res() res: any) {
    const token = (req.user as any)?.access_token ?? null;
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/oauth-redirect?token=${token}`,
    );
  }
}
