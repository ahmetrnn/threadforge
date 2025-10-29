import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("[API POST] No user – 401");
      return NextResponse.json({ error: 'Unauthorized – login ol!' }, { status: 401 });
    }
    console.log("[API POST] User OK:", user.email);

    const body = await req.json();
    console.log("[API POST] Body OK:", body);

    const { mode, thread } = body;
    if (!thread || !Array.isArray(thread) || thread.length === 0) {
      return NextResponse.json({ error: 'Thread data required' }, { status: 400 });
    }

    // Fetch x_tokens from Supabase
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('x_tokens, x_username, x_connected_at')
      .eq('auth_user_id', user.id)
      .single();

    console.log("[API POST] User data:", {
      hasData: !!userData,
      hasTokens: !!userData?.x_tokens,
      hasAccessToken: !!userData?.x_tokens?.access_token,
      username: userData?.x_username,
      connectedAt: userData?.x_connected_at,
      fetchError
    });

    if (fetchError) {
      console.error("[API POST] Database fetch error:", fetchError);
      return NextResponse.json({ error: `Database error: ${fetchError.message}` }, { status: 500 });
    }

    if (!userData) {
      console.error("[API POST] No user data found");
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    if (!userData.x_tokens?.access_token) {
      console.error("[API POST] No X access token - user needs to connect");
      return NextResponse.json({ error: 'X account not connected. Click "Connect X for Auto-Post" first!' }, { status: 401 });
    }

    const access_token = userData.x_tokens.access_token;
    console.log("[API POST] Access token OK (preview):", access_token.substring(0, 10) + '...');

    let tweetIds: string[] = [];
    let previousId: string | undefined = undefined;

    for (const { text, emojis = [] } of thread) {
      const tweetText = `${text} ${emojis.join(' ')}`.trim().slice(0, 280);

      const postBody: any = { text: tweetText };
      if (previousId) {
        postBody.reply = { in_reply_to_tweet_id: previousId };
      }

      const response = await fetch('https://api.x.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("[API POST] X API error:", data);
        return NextResponse.json({ error: data.errors?.[0]?.message || 'X post failed' }, { status: 500 });
      }

      const tweetId = data.data?.id;
      if (!tweetId) {
        console.error("[API POST] No tweet ID in response:", data);
        return NextResponse.json({ error: 'No tweet ID returned' }, { status: 500 });
      }

      tweetIds.push(tweetId);
      previousId = tweetId;
      console.log("[API POST] Tweet posted ID:", tweetId);
    }

    return NextResponse.json({ tweetIds });
  } catch (error) {
    console.error("[API POST] Full error:", error);
    return NextResponse.json({ error: 'Post failed – check logs' }, { status: 500 });
  }
}
