"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = createSupabaseBrowserClient();

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back. Time to ship threads.");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account ready! Check your inbox if email confirmation is required.");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGitHub = async () => {
    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
    if (error) {
      toast.error("GitHub login failed.");
      console.error(error);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-200" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@shipit.dev"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-200" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "One sec..." : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGitHub}
        >
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
