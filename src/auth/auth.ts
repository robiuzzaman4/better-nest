import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { db } from '../db';

export const auth = betterAuth({
  //  === DATABASE ===
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),

  //  === BASE URL ===
  // baseURL: the URL of THIS NestJS server
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  // trustedOrigins: your frontend URL(s) — add later when you have a frontend
  // trustedOrigins: ["http://localhost:3001"],

  //  === SECRET ===
  secret: process.env.BETTER_AUTH_SECRET!,

  //  === USER ===
  // Tell Better Auth your user table has a 'name' and 'phone' field
  user: {
    additionalFields: {
      // 'name' is already included by Better Auth by default
      // 'phone' comes from the phoneNumber plugin
      // Nothing extra needed here for now — you can add later
    },
  },

  //  === SOCIAL PROVIDERS ===
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

  //  === SESSION ===
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // renew if older than 1 day
  },
});

export type Auth = typeof auth;
