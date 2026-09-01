# Finance Tracker

Multi-currency personal finance dashboard — accounts, transactions, net worth,
cash-flow forecasting, savings objectives, and loans.

Built with Next.js 16 (App Router), Postgres on Neon, and Tailwind + shadcn/ui.

## Setup

Requires Node 20+ and a Postgres database.

```bash
npm install
```

Create `.env.local`:

```bash
DATABASE_URL=postgres://...      # Neon pooled connection string
SESSION_SECRET=...               # openssl rand -base64 32
```

If the project is linked to Vercel, `DATABASE_URL` is already set there and can
be pulled with `vercel env pull`. Generate `SESSION_SECRET` yourself — rotating
it invalidates every existing session.

Apply the schema, then start the dev server:

```bash
npm run db:migrate
npm run dev
```

Sign up at `/login` to create the first account.

## Architecture

**Database.** Plain Postgres, accessed with the Neon serverless driver through
tagged-template queries in `src/lib/queries.ts` (reads) and the per-route
`actions.ts` files (writes). Values interpolated into `` sql`...` `` are sent as
bound parameters, not concatenated.

**Auth.** Email + password, hashed with scrypt (`src/lib/password.ts`). Sessions
are stateless JWTs signed with `SESSION_SECRET` and stored in an httpOnly cookie
(`src/lib/session.ts`).

**Authorization.** This is the part worth understanding. There is no Row Level
Security — that was a Supabase feature built on `auth.uid()`, and it does not
exist here. Every query that touches user data must filter on `user_id`
explicitly, and the id must come from `requireUserId()` in `src/lib/dal.ts`,
never from a form field or a client argument.

`src/proxy.ts` also redirects signed-out visitors, but that check is optimistic
only — it reads the cookie and never queries the database. It is not the
security boundary; the `user_id` filter is.

## Migrations

SQL files in `migrations/`, applied in filename order by `npm run db:migrate`.
Each runs in a transaction and is written to be idempotent, so re-running is
safe. Add new files as `0002_*.sql`, `0003_*.sql`, and so on.
