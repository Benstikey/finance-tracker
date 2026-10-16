import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Finance, or create a free account to track your net worth across every currency.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
