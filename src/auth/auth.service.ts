import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from './auth';
import { db } from '../db';
import { user } from '../../drizzle/better-auth-schema';

const sendOtpSchema = z.object({
  phoneNumber: z.string().trim().min(1, 'phoneNumber is required'),
});

const verifyPhoneNumberSchema = z.object({
  phoneNumber: z.string().trim().min(1, 'phoneNumber is required'),
  code: z.string().trim().min(1, 'code is required'),
  name: z.string().trim().min(1, 'name is required'),
});

const signInPhoneNumberSchema = z.object({
  phoneNumber: z.string().trim().min(1, 'phoneNumber is required'),
  password: z.string().min(1, 'password is required'),
  rememberMe: z.boolean().optional(),
});

const requestPasswordResetSchema = z.object({
  phoneNumber: z.string().trim().min(1, 'phoneNumber is required'),
});

const resetPasswordSchema = z.object({
  phoneNumber: z.string().trim().min(1, 'phoneNumber is required'),
  otp: z.string().trim().min(1, 'otp is required'),
  newPassword: z.string().min(1, 'newPassword is required'),
});

const registerPhoneNumberSchema = z.object({
  phoneNumber: z.string().trim().min(1, 'phoneNumber is required'),
  code: z.string().trim().min(1, 'code is required'),
  name: z.string().trim().min(1, 'name is required'),
  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .max(128, 'password must be at most 128 characters'),
});

@Injectable()
export class AuthService {
  async sendPhoneNumberOtp(payload: unknown) {
    const body = this.parseBody(sendOtpSchema, payload);

    const betterAuthResponse = await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber: body.phoneNumber,
      },
    });

    return betterAuthResponse;
  }

  async verifyPhoneNumber(payload: unknown) {
    const body = this.parseBody(verifyPhoneNumberSchema, payload);

    const betterAuthResponse = await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber: body.phoneNumber,
        code: body.code,
        disableSession: true,
      },
    });

    if (betterAuthResponse.user?.id) {
      await db
        .update(user)
        .set({
          name: body.name,
          updatedAt: new Date(),
        })
        .where(eq(user.id, betterAuthResponse.user.id));

      betterAuthResponse.user.name = body.name;
    }

    return betterAuthResponse;
  }

  async registerWithPhoneNumber(payload: unknown) {
    const body = this.parseBody(registerPhoneNumberSchema, payload);

    // Single call — password flows as extra field to callbackOnVerification hook
    const betterAuthResponse = await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber: body.phoneNumber,
        code: body.code,
        password: body.password,
        disableSession: true,
      },
    });

    // Update user name in DB
    if (betterAuthResponse.user?.id) {
      await db
        .update(user)
        .set({ name: body.name, updatedAt: new Date() })
        .where(eq(user.id, betterAuthResponse.user.id));

      betterAuthResponse.user.name = body.name;
    }

    return betterAuthResponse;
  }

  async signInPhoneNumber(payload: unknown) {
    const body = this.parseBody(signInPhoneNumberSchema, payload);

    const betterAuthResponse = await auth.api.signInPhoneNumber({
      body,
    });

    return betterAuthResponse;
  }

  async requestPasswordReset(payload: unknown) {
    const body = this.parseBody(requestPasswordResetSchema, payload);

    const betterAuthResponse = await auth.api.requestPasswordResetPhoneNumber({
      body,
    });

    return betterAuthResponse;
  }

  async resetPassword(payload: unknown) {
    const body = this.parseBody(resetPasswordSchema, payload);

    const betterAuthResponse = await auth.api.resetPasswordPhoneNumber({
      body,
    });

    return betterAuthResponse;
  }

  private parseBody<T extends z.ZodType>(schema: T, payload: unknown) {
    const result = schema.safeParse(payload);

    if (!result.success) {
      throw new BadRequestException(
        result.error.issues.map((issue) => issue.message),
      );
    }

    return result.data;
  }
}
