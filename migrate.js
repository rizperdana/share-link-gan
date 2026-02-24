const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read the connection URL from .env (since it might have special characters)
const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const match = env.match(/SUPABASE_POSGRES_URL=(.+)/);
if (!match) {
  console.error("SUPABASE_POSGRES_URL not found in .env");
  process.exit(1);
}

const rawUrl = match[1].trim();
// The URL format is postgresql://user:password@host:port/database
// Wait, regex to safely extract everything:
const parts = rawUrl.match(/^postgresql:\/\/([^:]+):(.+)@([^@]+):(\d+)\/(.+)$/);
if (!parts) {
  console.error("URL does not match expected format.");
  process.exit(1);
}

const user = parts[1];
const password = parts[2];
const host = parts[3];
const port = parseInt(parts[4], 10);
const database = parts[5];

console.log(`Connecting to Postgres at ${host}...`);

const client = new Client({
  user,
  password,
  host,
  port,
  database,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

async function migrate() {
  try {
    await client.connect();
    console.log("Connected to database successfully.");

    const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');

    console.log("Running migration...");
    await client.query(schemaSql);

    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
