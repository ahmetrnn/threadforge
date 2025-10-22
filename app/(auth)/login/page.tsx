import Link from "next/link";
import { Metadata } from "next";

import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Login — ThreadForge",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-50">Welcome back to ThreadForge</h1>
        <p className="text-sm text-neutral-400">Log in to keep your thread streak alive.</p>
      </div>
      <AuthForm mode="login" />
      <p className="text-center text-sm text-neutral-500">
        Need an account?{" "}
        <Link href="/signup" className="text-neutral-200 hover:text-brand">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
