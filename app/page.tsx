import Link from "next/link";
import { revalidatePath } from "next/cache";

import { WaitlistForm, WaitlistState } from "@/components/WaitlistForm";
import { createSupabaseServerActionClient } from "@/lib/supabase";

const features = [
  {
    title: "Maker-tuned hooks",
    description:
      "Craft irresistible openers that feel indie, not corporate. ThreadForge knows builder energy.",
  },
  {
    title: "Auto emojis + CTAs",
    description: "Generate punchy tweets with emoji cues and call-to-actions you can actually ship.",
  },
  {
    title: "Freemium friendly",
    description: "Spin up 100 threads/month free. When you’re ready to go ham, Pro is just $9/mo.",
  },
];

async function joinWaitlist(_state: WaitlistState, formData: FormData): Promise<WaitlistState> {
  "use server";

  const email = formData.get("email")?.toString().trim();
  if (!email) {
    return { loading: false, error: true, message: "Email is required." };
  }

  try {
    const supabase = createSupabaseServerActionClient();
    const { error } = await supabase
      .from("users")
      .upsert({ email, subscription_status: "free" }, { onConflict: "email" });

    if (error) {
      console.error(error);
      return { loading: false, error: true, message: "Couldn’t add you right now. Try later." };
    }

    revalidatePath("/");
    return { loading: false, error: false, message: "You’re on the list! We’ll ping you soon." };
  } catch (error) {
    console.error(error);
    return { loading: false, error: true, message: "Supabase tripped. Try again." };
  }
}

export default function HomePage() {
  const waitlistInitialState: WaitlistState = { loading: false };
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-20 px-4 py-16 md:py-24">
      <section className="space-y-10">
        <div className="flex flex-col gap-6 text-center md:text-left">
          <span className="inline-block self-center rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 text-xs uppercase tracking-[0.3rem] text-neutral-400 md:self-start">
            AI threads for indie makers
          </span>
          <h1 className="text-4xl font-bold leading-tight text-neutral-50 md:text-6xl">
            Craft viral X threads in 60 seconds.
          </h1>
          <p className="max-w-2xl text-lg text-neutral-400 md:text-xl">
            Drop your topic, pick the vibe, select a template. ThreadForge’s GPT-4o-mini stack spits out 5-10 tweet threads packed with hooks, emojis, and CTAs.
          </p>
        </div>

        <WaitlistForm action={joinWaitlist} initialState={waitlistInitialState} />

        <div className="flex flex-col items-center justify-start gap-4 md:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand/90"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-neutral-800 bg-transparent px-4 py-2 text-sm font-medium text-neutral-100 transition hover:bg-neutral-900"
          >
            Log in
          </Link>
          <p className="text-sm text-neutral-500">100 free threads a month. No credit card.</p>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-6">
            <h3 className="text-lg font-semibold text-neutral-100">{feature.title}</h3>
            <p className="mt-3 text-sm text-neutral-400">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-10 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-50">Upgrade when you’re ready.</h2>
          <p className="text-sm text-neutral-400">
            Start free with 100 thread generations every month. When launches are weekly and you need more output, go Pro for unlimited generations.
          </p>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li>• Unlimited AI threads with maker tone</li>
            <li>• Saved prompts for your favorite vibes</li>
            <li>• Stripe-secured billing (cancel anytime)</li>
          </ul>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-8">
          <div>
            <div className="text-sm uppercase tracking-wide text-neutral-400">Free</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-50">$0</span>
              <span className="text-sm text-neutral-500">/ month</span>
            </div>
            <p className="mt-2 text-sm text-neutral-400">100 threads a month. No card required.</p>
          </div>
          <div className="mt-8 border-t border-neutral-800 pt-8">
            <div className="text-sm uppercase tracking-wide text-neutral-400">Pro</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-50">$9</span>
              <span className="text-sm text-neutral-500">/ month</span>
            </div>
            <p className="mt-2 text-sm text-neutral-400">Unlimited threads, priority roadmap say.</p>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-neutral-900 pt-8 text-sm text-neutral-500 md:flex-row">
        <p>© {new Date().getFullYear()} ThreadForge. Built by indie hackers, for indie hackers.</p>
        <div className="flex gap-4">
          <Link href="/login" className="transition hover:text-neutral-200">
            Login
          </Link>
          <Link href="/signup" className="transition hover:text-neutral-200">
            Signup
          </Link>
        </div>
      </footer>
    </main>
  );
}
