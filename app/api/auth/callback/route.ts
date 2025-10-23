import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase";

type XTokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token?: string;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }

  const cookieStore = cookies();
  const storedState = cookieStore.get("x_oauth_state")?.value;
  const codeVerifier = cookieStore.get("x_oauth_code_verifier")?.value;

  if (!storedState || !codeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/dashboard?error=state_mismatch", request.url));
  }

  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  const redirectUri = process.env.X_REDIRECT_URI ?? "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    console.error("Missing X client credentials. Check environment variables.");
    return NextResponse.redirect(new URL("/dashboard?error=server_config", request.url));
  }

  const tokenResponse = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    console.error("X token exchange failed", tokenResponse.status, errorBody);
    return NextResponse.redirect(new URL("/dashboard?error=token_failed", request.url));
  }

  const tokenPayload = (await tokenResponse.json()) as XTokenResponse;
  const { access_token, refresh_token, expires_in, token_type, scope } = tokenPayload;

  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();
  const { error: updateError } = await supabase
    .from("users")
    .update({
      x_tokens: {
        access_token,
        refresh_token,
        expires_in,
        expires_at: expiresAt,
        token_type,
        scope,
        updated_at: new Date().toISOString(),
      },
    })
    .eq("auth_user_id", user.id);

  if (updateError) {
    console.error("Unable to persist X tokens", updateError);
    return NextResponse.redirect(new URL("/dashboard?error=token_persist_failed", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard?success=connected", request.url));
  response.cookies.delete("x_oauth_state");
  response.cookies.delete("x_oauth_code_verifier");
  return response;
}
