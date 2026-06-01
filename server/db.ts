import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const hasValidDatabaseUrl =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('username:password@localhost');

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (hasValidDatabaseUrl) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  console.warn("⚠️  DATABASE_URL not configured properly. Using mock database for development.");
  console.warn("📝 To fix this:");
  console.warn("   1. Create a Neon database at https://neon.tech");
  console.warn("   2. Copy your connection string");
  console.warn("   3. Update DATABASE_URL in your .env file");
}

export { pool, db };
