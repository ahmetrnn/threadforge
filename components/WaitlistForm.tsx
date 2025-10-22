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
    <Button type="submit" className="w-full md:w-auto" disabled={pending}>
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
      className="flex w-full flex-col items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 backdrop-blur md:flex-row"
    >
      <Input
        type="email"
        name="email"
        placeholder="you@buildinpublic.dev"
        required
        className="md:max-w-xs"
      />
      <SubmitButton />
      {state.message ? (
        <p className={`w-full text-center text-xs ${state.error ? "text-red-400" : "text-green-400"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
