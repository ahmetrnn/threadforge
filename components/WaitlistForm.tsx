"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type WaitlistState = {
  loading: boolean;
  message?: string;
  error?: boolean;
};

type WaitlistFormProps = {
  action: (_state: WaitlistState, formData: FormData) => Promise<WaitlistState>;
  initialState?: WaitlistState;
};

const defaultState: WaitlistState = { loading: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-cyan-500 text-black font-semibold shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] md:w-auto"
      disabled={pending}
    >
      {pending ? "Joining..." : "Join the waitlist"}
    </Button>
  );
}

export function WaitlistForm({ action, initialState = defaultState }: WaitlistFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:flex-row"
    >
      <Input
        type="email"
        name="email"
        placeholder="you@buildinpublic.dev"
        required
        className="flex-1 bg-transparent border-white/20 text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 md:max-w-md"
      />
      <SubmitButton />
      {state.message ? (
        <p className={`w-full text-center text-sm font-light ${state.error ? "text-red-400" : "text-cyan-400"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
