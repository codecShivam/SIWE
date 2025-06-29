import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/evm_wallet';

// Create connection
const sql = postgres(DATABASE_URL);
export const db = drizzle(sql, { schema });

// Test database connection
export async function testConnection() {
  try {
    await sql`SELECT 1 as test`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Export connection for cleanup
export { sql }; 