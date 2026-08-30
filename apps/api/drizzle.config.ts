import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env.js';

const connectionString = env.DATABASE_URL;

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  verbose: true,
  dbCredentials: {
    url: connectionString,
    ssl: true,
  },
});
