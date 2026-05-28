import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// neon() creates a serverless SQL function bound to DATABASE_URL
const sql = neon(process.env.DATABASE_URL!);

// drizzle() wraps it in the ORM
export const db = drizzle(sql);

export type DB = typeof db;
