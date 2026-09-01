import "server-only";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

/**
 * Neon's HTTP driver. Each tagged-template call is one round trip, which suits
 * serverless invocations — there is no pool to exhaust.
 *
 * Interpolated values are sent as bound parameters, never string-concatenated,
 * so `sql\`... where id = ${id}\`` is injection-safe.
 */
export const sql = neon(process.env.DATABASE_URL);
