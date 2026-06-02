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

  // === EMAIL & PASSWORD (enables credential provider for phone+password sign-in) ===
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
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
      // Hash password & create credential account during OTP verification.
      // The password is passed as an extra body field from the /register endpoint.
      callbackOnVerification: async ({ phoneNumber: phone, user }, ctx) => {
        const body = (ctx as unknown as { body: Record<string, unknown> })
          ?.body;
        const password = body?.password;

        if (typeof password !== 'string' || password.length < 8) {
          return;
        }

        // Prevent duplicate credential accounts on re-verification
        const accounts =
          await ctx!.context.internalAdapter.findAccountByUserId(user.id);
        const hasCredential = accounts.some(
          (a) => a.providerId === 'credential',
        );

        if (!hasCredential) {
          const hashedPassword = await ctx!.context.password.hash(password);
          await ctx!.context.internalAdapter.createAccount({
            userId: user.id,
            providerId: 'credential',
            accountId: user.id,
            password: hashedPassword,
          });
        }
      },
    }),
  ],
});

export type Auth = typeof auth;
