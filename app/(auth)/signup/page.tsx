import Link from "next/link";
import { Metadata } from "next";

import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up — ThreadForge",
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-50">Join ThreadForge</h1>
        <p className="text-sm text-neutral-400">Create an account to start generating viral X threads.</p>
      </div>
      <AuthForm mode="signup" />
      <p className="text-center text-sm text-neutral-500">
        Already shipping threads?{" "}
        <Link href="/login" className="text-neutral-200 hover:text-brand">
          Log in here
        </Link>
      </p>
    </div>
  );
}
