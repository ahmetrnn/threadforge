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

    // Remove X account information from users table
    const { error: updateError } = await supabase
      .from("users")
      .update({
        x_account_id: null,
        x_username: null,
        x_access_token: null,
        x_refresh_token: null,
        x_connected_at: null,
        x_token_expires_at: null,
      })
      .eq("auth_user_id", session.user.id);

    if (updateError) {
      console.error("Error disconnecting X account:", updateError);
      return NextResponse.json(
        { error: "Failed to disconnect X account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "X account disconnected successfully.",
    });
  } catch (error) {
    console.error("X account disconnection error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
