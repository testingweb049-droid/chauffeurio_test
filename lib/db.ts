import { Client } from '@neondatabase/serverless';

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
