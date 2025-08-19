import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection URL
const DATABASE_URL = process.env.DATABASE_URL!;

// Create connection
const sql = postgres(DATABASE_URL);
export const db = drizzle(sql, { schema });


// Export connection for cleanup
export { sql }; 