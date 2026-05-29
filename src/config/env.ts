import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL.'),
  BETTER_AUTH_URL: z
    .string()
    .url('BETTER_AUTH_URL must be a valid URL.')
    .default('http://localhost:3000'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, 'BETTER_AUTH_SECRET is required. Please set it in your .env file.'),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, 'GOOGLE_CLIENT_ID is required for social login.'),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, 'GOOGLE_CLIENT_SECRET is required for social login.'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment Variable Validation Failed');
  console.error('Please check your .env file and fix the following issues:');

  for (const issue of parsed.error.issues) {
    console.error(`${issue.path.join('.')}: ${issue.message}`);
  }

  // Exit the process if environment variables are invalid
  process.exit(1);
}

export const env = parsed.data;
