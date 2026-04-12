"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Finance Tracker
          </h1>
        </div>
        <div className="space-y-4">
          <blockquote className="text-lg font-medium leading-relaxed opacity-90">
            &ldquo;Track every dirham, dollar, and euro — all in one place.&rdquo;
          </blockquote>
          <div className="flex gap-3 text-sm opacity-70">
            <span className="rounded-full border border-primary-foreground/20 px-3 py-1">
              MAD
            </span>
            <span className="rounded-full border border-primary-foreground/20 px-3 py-1">
              USD
            </span>
            <span className="rounded-full border border-primary-foreground/20 px-3 py-1">
              EUR
            </span>
          </div>
        </div>
        <p className="text-xs opacity-50">
          Multi-currency finance dashboard
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Finance Tracker
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? "Enter your details to get started"
                : "Enter your credentials to access your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="h-11"
              />
            </div>

            {error && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  error.includes("Check your email")
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-destructive/20 bg-destructive/5 text-destructive"
                }`}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </span>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your data is stored securely with Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
