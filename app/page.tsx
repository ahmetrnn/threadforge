import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPageClient } from "@/components/LandingPageClient";
import { User } from "@supabase/supabase-js";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    console.log("Fetching user data for credits:", user.id);
    const { data: userData, error } = await supabase
      .from("users")
      .select("threads_used")
      .eq("auth_user_id", user.id)
      .single();

    console.log("User data query result:", { userData, error });

    if (error && error.code !== "PGRST116") {
      // PGRST116: 'No rows found'
      console.error("Error fetching user data:", error);
      // Handle the error appropriately, maybe redirect to an error page
    }

    // Calculate credits as 100 - threads_used (assuming 100 free credits)
    const credits = 100 - (userData?.threads_used ?? 0);

    return (
      <LandingPageClient
        user={user as User}
        initialCredits={Math.max(0, credits)}
      />
    );
  }

  return <LandingPageClient user={null} initialCredits={0} />;
}