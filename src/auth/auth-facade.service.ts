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

@Injectable()
export class AuthFacadeService {
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
