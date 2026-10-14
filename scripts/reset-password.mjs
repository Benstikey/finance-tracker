/**
 * Sets a new password for an existing user, keeping all of their data.
 *
 *   npm run user:reset-password -- you@example.com
 *
 * The password is read from the terminal with echo disabled, so it never
 * appears on screen, in shell history, or in process arguments. That is also
 * why there is deliberately no flag or env var for passing it in.
 *
 * The hash format must match src/lib/password.ts (`scrypt$<salt>$<hash>`,
 * 16-byte salt, 64-byte key, Node's default scrypt cost). That module is
 * server-only TypeScript and can't be imported from here, so if its parameters
 * ever change, change them here too.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scrypt = promisify(scryptCb);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const CTRL_C = String.fromCharCode(3);
const DELETE = String.fromCharCode(127); // what most terminals send for Backspace
const BACKSPACE = String.fromCharCode(8);

if (!process.env.DATABASE_URL) {
  try {
    for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq > 0) process.env[t.slice(0, eq).trim()] ??= t.slice(eq + 1).trim();
    }
  } catch {
    // no .env.local — rely on the ambient environment
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

/** Read a line from the TTY without echoing it. */
function promptHidden(question) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();

    let value = "";
    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
    };
    // A paste arrives as one chunk, so walk it character by character.
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          cleanup();
          resolve(value);
          return;
        }
        if (ch === CTRL_C) {
          cleanup();
          process.exit(130);
        }
        if (ch === DELETE || ch === BACKSPACE) value = value.slice(0, -1);
        else value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!email) fail("Usage: npm run user:reset-password -- you@example.com");
if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set (env or .env.local).");
if (!process.stdin.isTTY) fail("Run this in an interactive terminal — the password is read from the keyboard.");

const sql = neon(process.env.DATABASE_URL);

const [user] = await sql`select id from users where lower(email) = ${email}`;
if (!user) fail(`No user with email ${email}.`);

const password = await promptHidden("New password: ");
if (password.length < 6) fail("Password must be at least 6 characters.");
const confirm = await promptHidden("Confirm password: ");
if (password !== confirm) fail("Passwords don't match — nothing was changed.");

const salt = randomBytes(16);
const derived = await scrypt(password, salt, 64);
const hash = `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;

await sql`update users set password_hash = ${hash} where id = ${user.id}`;
console.log(`Password updated for ${email}. Your data is untouched.`);
