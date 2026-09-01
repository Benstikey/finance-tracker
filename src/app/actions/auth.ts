"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = { error?: string; success?: string } | undefined;

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);

  if (!email || !email.includes("@")) return { error: "Enter a valid email." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  const existing = await sql`
    select id from users where lower(email) = ${email} limit 1
  `;
  if (existing.length > 0)
    return { error: "An account with that email already exists." };

  const passwordHash = await hashPassword(password);
  const rows = await sql`
    insert into users (email, password_hash)
    values (${email}, ${passwordHash})
    returning id
  `;

  const user = rows[0];
  if (!user) return { error: "Could not create your account. Try again." };

  await createSession(user.id as string);
  redirect("/dashboard");
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);

  if (!email || !password)
    return { error: "Enter your email and password." };

  const rows = await sql`
    select id, password_hash from users where lower(email) = ${email} limit 1
  `;
  const user = rows[0];

  // Same message whether the email is unknown or the password is wrong, so the
  // form can't be used to enumerate which addresses have accounts.
  const invalid = { error: "Invalid email or password." };
  if (!user) return invalid;

  const ok = await verifyPassword(password, user.password_hash as string);
  if (!ok) return invalid;

  await createSession(user.id as string);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
