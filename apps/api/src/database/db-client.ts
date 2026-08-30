import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env.js';
import { relations } from './relations.js';

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString });

export const databaseClient = drizzle({ client: pool, relations });
