import { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/DashboardClient";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Dashboard — ThreadForge",
};

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userId = user.id;
  const email = user.email ?? "maker";

  let { data: profile } = await supabase
    .from("users")
    .select("threads_used, subscription_status, email, x_username, x_connected_at")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (!profile) {
    const { data: insertedProfile } = await supabase
      .from("users")
      .upsert(
        {
          auth_user_id: userId,
          email,
          subscription_status: "free",
        },
        { onConflict: "email" }
      )
      .select("threads_used, subscription_status, email, x_username, x_connected_at")
      .single();
    profile = insertedProfile ?? { threads_used: 0, subscription_status: "free", email, x_username: null, x_connected_at: null };
  }

  const xTokens = (profile?.x_tokens ?? null) as { access_token?: string } | null;
  const isXConnected = Boolean(xTokens?.access_token);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <DashboardClient
        initialThreadCount={profile?.threads_used ?? 0}
        subscriptionStatus={(profile?.subscription_status as "free" | "pro") ?? "free"}
        email={profile?.email ?? email}
        xUsername={profile?.x_username}
        xConnectedAt={profile?.x_connected_at}
      />
    </div>
  );
}
