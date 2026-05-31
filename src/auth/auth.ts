import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { db } from '../db';
import { env } from '../config/env';
import * as schema from '../../drizzle/better-auth-schema';

export const auth = betterAuth({
  // === DATABASE ===
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: false,
    schema,
  }),

  // === BASE URL & PATH ===
  basePath: '/api/v1/auth',
  baseURL: env.BETTER_AUTH_URL, // "http://localhost:5000"
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: ['http://localhost:3000', 'http://localhost:3001'],

  // === FIELD MAPPING FOR CONSISTENT CAMELCASE API ===
  user: {
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      phoneNumber: 'phone_number',
      phoneNumberVerified: 'phone_number_verified',
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      userId: 'user_id',
    },
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

  // === SOCIAL PROVIDERS ===
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  // === PHONE NUMBER PLUGIN ===
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      sendOTP: ({ phoneNumber, code }) => {
        console.log(`[DEV] OTP for ${phoneNumber}: ${code}`);
      },
      signUpOnVerification: {
        getTempEmail: (phone) =>
          `${phone.replace(/\+/g, '')}@phone.yourapp.com`,
        getTempName: (phone) => phone,
      },
    }),
  ],
});

export type Auth = typeof auth;
