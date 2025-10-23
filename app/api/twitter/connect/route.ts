import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();

    // Get current authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    // Get user's provider token from Supabase auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Failed to get user information." },
        { status: 500 }
      );
    }

    // Extract Twitter account info from user metadata
    const twitterIdentity = user.identities?.find(
      (identity) => identity.provider === "twitter"
    );

    if (!twitterIdentity) {
      return NextResponse.json(
        { error: "No Twitter account linked. Please sign in with X first." },
        { status: 400 }
      );
    }

    // Get Twitter username from identity data
    const twitterUsername = twitterIdentity.identity_data?.user_name ||
                           twitterIdentity.identity_data?.screen_name ||
                           twitterIdentity.identity_data?.name;
    const twitterAccountId = twitterIdentity.identity_data?.sub || twitterIdentity.id;

    // Store X account information in users table
    const { error: updateError } = await supabase
      .from("users")
      .update({
        x_account_id: twitterAccountId,
        x_username: twitterUsername,
        x_connected_at: new Date().toISOString(),
      })
      .eq("auth_user_id", session.user.id);

    if (updateError) {
      console.error("Error updating user X account:", updateError);
      return NextResponse.json(
        { error: "Failed to connect X account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "X account connected successfully.",
      username: twitterUsername,
    });
  } catch (error) {
    console.error("X account connection error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
