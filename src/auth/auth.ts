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

  // === SESSION ===
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
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
      sendPasswordResetOTP: ({ phoneNumber, code }) => {
        console.log(`[DEV] Password reset OTP for ${phoneNumber}: ${code}`);
      },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone.replace(/\+/g, '')}@phone.rusign.com`,
        getTempName: (phone) => phone,
      },
    }),
  ],
});

export type Auth = typeof auth;
