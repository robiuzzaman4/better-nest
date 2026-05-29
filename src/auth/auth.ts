import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { db } from '../db';
import { env } from '../config/env';

export const auth = betterAuth({
  //  === DATABASE ===
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: false,
  }),

  //  === BASE URL ===
  // baseURL: the URL of THIS NestJS server
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/v1/auth',

  // trustedOrigins: your frontend URL(s) — add later when you have a frontend
  // trustedOrigins: ["http://localhost:3001"],

  //  === SECRET ===
  secret: env.BETTER_AUTH_SECRET,

  //  === USER ===
  // Tell Better Auth your user table has a 'name' and 'phone' field
  user: {
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      image: 'image',
      phoneNumber: 'phone_number',
      phoneNumberVerified: 'phone_number_verified',
    },
  },

  session: {
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      userId: 'user_id',
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // renew if older than 1 day
  },

  account: {
    fields: {
      accountId: 'account_id',
      providerId: 'provider_id',
      userId: 'user_id',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      idToken: 'id_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },

  verification: {
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },

  //  === SOCIAL PROVIDERS ===
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  //  === PHONE NUMBER PLUGIN ===
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300, // 5 minutes — for OTP (Phase 2)

      // sendOTP is required by the plugin signature but
      // you're not using OTP in Phase 1 — stub it out.
      // IMPORTANT: do NOT await this — prevents timing attacks.
      sendOTP: ({ phoneNumber, code }) => {
        // Phase 1: console log for local dev
        console.log(`[DEV] OTP for ${phoneNumber}: ${code}`);
        // Phase 2: replace with your BD SMS provider call
      },

      // ✅ Allow sign-up using just phone + password
      // This generates a placeholder email so Better Auth's user
      // table (which requires an email column) doesn't complain.
      signUpOnVerification: {
        getTempEmail: (phone) =>
          `${phone.replace(/\+/g, '')}@phone.yourapp.com`,
        getTempName: (phone) => phone,
      },
    }),
  ],
});

export type Auth = typeof auth;
