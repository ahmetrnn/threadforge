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
    .select("threads_used, subscription_status, email, x_username, x_connected_at, x_tokens")
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
      .select("threads_used, subscription_status, email, x_username, x_connected_at, x_tokens")
      .single();
    profile = insertedProfile ?? { threads_used: 0, subscription_status: "free", email, x_username: null, x_connected_at: null, x_tokens: null };
  }

  const xTokens = (profile?.x_tokens ?? null) as { access_token?: string } | null;
  const isXConnected = Boolean(xTokens?.access_token);

  // Fetch available templates/hooks from Supabase
  const { data: templates } = await supabase
    .from("templates")
    .select("id, slug, name, description, outline")
    .order("name");

  return (
    <div className="relative min-h-screen">
      {/* Futuristic background effects */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/10 via-[#0a0a0a] to-[#0a0a0a]" />
      <div className="pointer-events-none fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-10">
        <DashboardClient
          initialThreadCount={profile?.threads_used ?? 0}
          subscriptionStatus={(profile?.subscription_status as "free" | "pro") ?? "free"}
          email={profile?.email ?? email}
          xUsername={profile?.x_username}
          xConnectedAt={profile?.x_connected_at}
          templates={templates ?? []}
        />
      </div>
    </div>
  );
}
