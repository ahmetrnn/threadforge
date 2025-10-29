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
  console.log("[X CALLBACK] Starting X OAuth callback...");
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  console.log("[X CALLBACK] Params:", { hasCode: !!code, hasState: !!state, error });

  if (error || !code || !state) {
    console.error("[X CALLBACK] Missing params or error from X");
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }

  const cookieStore = cookies();
  const storedState = cookieStore.get("x_oauth_state")?.value;
  const codeVerifier = cookieStore.get("x_oauth_code_verifier")?.value;

  console.log("[X CALLBACK] Cookies:", { hasStoredState: !!storedState, hasVerifier: !!codeVerifier, stateMatches: state === storedState });

  if (!storedState || !codeVerifier || state !== storedState) {
    console.error("[X CALLBACK] State mismatch or missing cookies");
    return NextResponse.redirect(new URL("/dashboard?error=state_mismatch", request.url));
  }

  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  const redirectUri = process.env.X_REDIRECT_URI ?? "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    console.error("Missing X client credentials. Check environment variables.");
    return NextResponse.redirect(new URL("/dashboard?error=server_config", request.url));
  }

  console.log("[X CALLBACK] Exchanging code for token...");
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
    console.error("[X CALLBACK] X token exchange failed", tokenResponse.status, errorBody);
    return NextResponse.redirect(new URL("/dashboard?error=token_failed", request.url));
  }

  const tokenPayload = (await tokenResponse.json()) as XTokenResponse;
  const { access_token, refresh_token, expires_in, token_type, scope } = tokenPayload;
  console.log("[X CALLBACK] Token received, expires_in:", expires_in);

  // Fetch X user profile to get username
  console.log("[X CALLBACK] Fetching X user profile...");
  const userProfileResponse = await fetch("https://api.x.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!userProfileResponse.ok) {
    const profileError = await userProfileResponse.text();
    console.error("[X CALLBACK] Failed to fetch X user profile", userProfileResponse.status, profileError);
    return NextResponse.redirect(new URL("/dashboard?error=profile_fetch_failed", request.url));
  }

  const userProfile = await userProfileResponse.json();
  console.log("[X CALLBACK] Profile response:", userProfile);
  const xUsername = userProfile.data?.username;
  const xAccountId = userProfile.data?.id;

  if (!xUsername) {
    console.error("[X CALLBACK] No username in X profile response", userProfile);
    return NextResponse.redirect(new URL("/dashboard?error=no_username", request.url));
  }

  console.log("[X CALLBACK] Got username:", xUsername);

  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  console.log("[X CALLBACK] Saving to database for user:", user.id);
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
      x_username: xUsername,
      x_account_id: xAccountId,
      x_connected_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id);

  if (updateError) {
    console.error("[X CALLBACK] Unable to persist X tokens", updateError);
    return NextResponse.redirect(new URL("/dashboard?error=token_persist_failed", request.url));
  }

  console.log("[X CALLBACK] Successfully saved X connection! Redirecting...");
  const response = NextResponse.redirect(new URL("/dashboard?x_connect=true", request.url));
  response.cookies.delete("x_oauth_state");
  response.cookies.delete("x_oauth_code_verifier");
  return response;
}
