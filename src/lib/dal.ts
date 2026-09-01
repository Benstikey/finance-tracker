import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * The authorization boundary for the whole app.
 *
 * Under Supabase, Row Level Security filtered rows by `auth.uid()` and page
 * queries could safely omit a user filter. Plain Postgres has no such policy
 * layer, so every query must scope by user_id itself — and this is where that
 * id comes from. Never read the session cookie directly in a page or action.
 *
 * `cache` dedupes the call within a single render pass.
 */
export const requireUserId = cache(async (): Promise<string> => {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session.userId;
});

/** Like requireUserId, but returns null instead of redirecting. */
export const optionalUserId = cache(async (): Promise<string | null> => {
  const session = await getSession();
  return session?.userId ?? null;
});
