import { NextResponse } from "next/server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createSupabaseRouteHandlerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
