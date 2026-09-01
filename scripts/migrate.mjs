/**
 * Applies every migrations/*.sql file in filename order.
 *
 * Uses the WebSocket Client rather than the HTTP driver because migration
 * files contain multiple statements (and `$$`-quoted function bodies), which
 * the single-shot HTTP endpoint won't accept.
 *
 * Each file runs inside a transaction, so a failure part-way leaves nothing
 * half-applied. The SQL itself is written to be idempotent (`if not exists`,
 * `on conflict do nothing`), so re-running is safe.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@neondatabase/serverless";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load DATABASE_URL from .env.local when not already in the environment.
if (!process.env.DATABASE_URL) {
  try {
    for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!process.env[key]) {
        process.env[key] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local — rely on the ambient environment
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (env or .env.local).");
  process.exit(1);
}

const dir = join(root, "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
if (files.length === 0) {
  console.error("No .sql files found in migrations/");
  process.exit(1);
}

const client = new Client(process.env.DATABASE_URL);
await client.connect();

try {
  for (const file of files) {
    process.stdout.write(`applying ${file} ... `);
    await client.query("begin");
    try {
      await client.query(readFileSync(join(dir, file), "utf8"));
      await client.query("commit");
      console.log("ok");
    } catch (err) {
      await client.query("rollback");
      console.log("FAILED");
      throw err;
    }
  }

  const { rows } = await client.query(
    `select table_name from information_schema.tables
     where table_schema = 'public' order by table_name`
  );
  console.log("\ntables:", rows.map((r) => r.table_name).join(", "));
} finally {
  await client.end();
}
