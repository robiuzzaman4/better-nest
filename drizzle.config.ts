import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config(); // loads .env before drizzle-kit reads it

export default {
  schema: './src/db/schema.ts',
  out: './drizzle', // migration files will be generated here
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
