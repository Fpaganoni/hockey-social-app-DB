# Auth Guide — Hockey Connect Backend

This document describes the authentication architecture, all supported providers, how to configure credentials, and the security model.

---

## Overview

The backend supports three authentication methods:

| Method           | Endpoint                 | Strategy                                   |
| ---------------- | ------------------------ | ------------------------------------------ |
| Email / Password | GraphQL mutation `login` | Local (bcrypt + JWT)                       |
| Google Sign In   | `GET /auth/google`       | `GoogleStrategy` (passport-google-oauth20) |
| Apple Sign In    | `POST /auth/apple`       | `AppleStrategy` (passport-apple)           |

All methods ultimately issue a **signed JWT** that the client uses as a Bearer token in all subsequent GraphQL requests.

---

## Architecture

```
Client
  │
  ├── GraphQL → users.resolver.ts → auth.service.ts (email/password login)
  │
  └── REST  → auth.controller.ts
                ├── GET  /auth/google          → GoogleStrategy → auth.service.ts
                ├── GET  /auth/google/callback ↗
                ├── POST /auth/apple           → AppleStrategy  → auth.service.ts
                └── POST /auth/apple/callback  ↗
```

After OAuth, the user is redirected to `/oauth-redirect?token=<JWT>`.  
The frontend reads the token and includes it as:

```
Authorization: Bearer <JWT>
```

---

## JWT Payload

```json
{
  "sub": "user-uuid",
  "username": "franco",
  "role": "PLAYER",
  "iat": 1700000000,
  "exp": 1700003600
}
```

---

## Database Schema — User Auth Fields

| Field          | Type           | Purpose                                                               |
| -------------- | -------------- | --------------------------------------------------------------------- |
| `password`     | `String?`      | Nullable — OAuth users never have a password                          |
| `authProvider` | `AuthProvider` | `EMAIL`, `GOOGLE`, or `APPLE`                                         |
| `socialId`     | `String?`      | Provider's unique user ID (Google `profile.id` / Apple `idToken.sub`) |

---

## Security Model

### Account Lookup Order (oauthLogin)

```
1. Find by (authProvider + socialId)   ← returning OAuth user
2. Find by email                       ← existing email account → link OAuth
3. Create new user                     ← first-time OAuth user
```

This prevents:

- **Account collision**: Two users with the same email but different providers cannot be confused.
- **Provider hijacking**: A user cannot log in as another user by reusing their email with a different provider.

### Email/Password Users

OAuth users (`authProvider != EMAIL`) have `password = null`.  
The `validateUser()` function in `AuthService` explicitly guards against this:

```typescript
if (!user || !user.password) return null; // Rejects OAuth accounts from password login
```

### Apple — Hide My Email

Apple users may use a **relay email address** (e.g. `abc123@privaterelay.appleid.com`).  
Never use Apple's email as a primary key. The system uses `socialId` (Apple's `sub`) as the primary identifier.

### Apple — First Login Only

Apple **only sends `name` and `email` on the very first login**. On all subsequent logins, only the `sub` is sent. This is why `socialId` must be persisted at first login — it's the only reliable identifier going forward.

---

## Setting Up Google Sign In

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. Enable **Google+ API** (or **People API**)
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized Redirect URI: `http://localhost:3000/auth/google/callback` (dev) or `https://yourdomain.com/auth/google/callback` (prod)
7. Copy **Client ID** and **Client Secret** to your `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

---

## Setting Up Apple Sign In

> ⚠️ Apple requires an **Apple Developer account** ($99/year) and an **HTTPS callback URL**.

### Step 1 — Enable Sign in with Apple on your App ID

- Apple Developer → **Certificates, IDs & Profiles → Identifiers → App IDs**
- Select your app → Edit → Enable **Sign in with Apple** → Save

### Step 2 — Create a Service ID (your `APPLE_CLIENT_ID`)

- **Identifiers → Service IDs → +**
- Description: `Hockey Connect Auth`, Identifier: `com.yourapp.auth`
- Enable **Sign in with Apple** → Configure
- Add your domain and **Return URLs** (must be HTTPS):
  - `https://your-ngrok.ngrok.io/auth/apple/callback` (dev)
  - `https://yourdomain.com/auth/apple/callback` (prod)

### Step 3 — Create a Key

- **Certificates, IDs & Profiles → Keys → +**
- Name: `Hockey Connect Sign In`, enable **Sign in with Apple**
- Configure: select your primary App ID
- Download the `.p8` file — **⚠️ you can only download it once**
- Note the **Key ID** shown on screen

### Step 4 — Collect your credentials

- `APPLE_CLIENT_ID` = the Service ID identifier (e.g. `com.yourapp.auth`)
- `APPLE_TEAM_ID` = shown in **Membership → Team ID** (10 chars)
- `APPLE_KEY_ID` = shown on the Key detail page (10 chars)
- `APPLE_PRIVATE_KEY` = the full content of the `.p8` file, with `\n` replacing real newlines

### Step 5 — Set environment variables

```env
APPLE_CLIENT_ID=com.yourapp.auth
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...\n-----END PRIVATE KEY-----"
APPLE_CALLBACK_URL=https://your-ngrok.ngrok.io/auth/apple/callback
```

### Local Development with ngrok

Apple requires HTTPS. To test locally:

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000
# Copy the https://xxx.ngrok.io URL
# Set APPLE_CALLBACK_URL=https://xxx.ngrok.io/auth/apple/callback
# Register this URL as a Return URL in the Service ID config on Apple Developer
```

---

## Testing the Flows

### Google

1. Start the server: `pnpm start:dev`
2. Open in browser: `http://localhost:3000/auth/google`
3. Complete Google sign in
4. You'll be redirected to `/oauth-redirect?token=eyJ...`
5. Decode the token at [jwt.io](https://jwt.io)

### Apple (requires ngrok + HTTPS)

1. Configure ngrok: `ngrok http 3000`
2. Register the ngrok URL as Return URL in Apple Developer Portal
3. Navigate to `https://<ngrok>.ngrok.io/auth/apple`
4. Complete Apple sign in
5. You'll be redirected to `/oauth-redirect?token=eyJ...`
