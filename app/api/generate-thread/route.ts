import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { getOpenAIClient } from "@/lib/openai";
import type { ThreadMode, ThreadTweet } from "@/types/thread";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Login ol kanka!" }, { status: 401 });
    }
    console.log("[API] User OK:", user.email);

    const body = await req.json().catch(() => ({}));
    console.log("[API] Body OK:", body);

    const rawDraft = typeof body.draft === "string" ? body.draft.trim() : "";
    const rawRefine = typeof body.refinePrompt === "string" ? body.refinePrompt.trim() : "";
    const rawStyle = typeof body.style === "string" ? body.style.trim() : "";
    const rawMode = body.mode as ThreadMode | undefined;

    if (!rawDraft) {
      return NextResponse.json({ error: "Draft required" }, { status: 400 });
    }

    const mode: ThreadMode = rawMode === "single" ? "single" : "thread";
    const refinePrompt = rawRefine || "raw viral thread";
    const style = rawStyle || "raw";

    const fewShotDataset = `Example 1: DRAFT="Vibe coding kaosu, bug'lar her yerde", REFINE_PROMPT="raw narrative", STYLE="raw", MODE="single"
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Vibe coding kaosu: Herkes 'hızlı ship' diyor ama bug'lar her yerde, D1'de 3 saat debug'la yattım, $0 MRR – kaos. Async patladı ama playlist tweak'le %50 verim up, 2 feature bitirdim, obsession gibi devam ettim. Senin kaosun nasıl, reply at DM al hack! #BuildInPublic",
      "emojis": ["😩"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "500-2K (raw kaos + arc)",
  "publishTips": "9AM post, bug screenshot ekle"
}

Example 2: DRAFT="SaaS growth ipucu", REFINE_PROMPT="funny listicle", STYLE="funny", MODE="thread"
{
  "thread": [
    {"tweetNumber":1, "text":"SaaS growth ipucu: Herkes 'viral ol' diyor ama benim ilk MRR $0, 3 ay kaos 😅. 1. Market gap bul – ben 500 lead gen ettim, conversion %30 ama overfeature churn up. Devam mı? (1/5)", "emojis":["🤯"], "isCta":false},
    {"tweetNumber":2, "text":"2. X tutorials post et – 4 thread/hafta, 2K view. Fail: Bug'la gece yattım, ama tweak'le MRR $500.", "emojis":[], "isCta":false},
    {"tweetNumber":3, "text":"3. Feedback al, refine UI – Discord join, 10 partner buldum, lazy vibe fast growth.", "emojis":[], "isCta":false},
    {"tweetNumber":4, "text":"4. Organic scale, ads yok – $1K MRR ilk ay. Raw win: Consistency marketer mindset.", "emojis":[], "isCta":false},
    {"tweetNumber":5, "text":"Takeaway: $100K MRR Dec 31'e. Reply at DM al ipucu, #SaaSGrowth.", "emojis":["🚀"], "isCta":true}
  ],
  "estimatedImpressions": "2K-10K (funny steps + metric)",
  "publishTips": "Akşam post, poll ekle"
}

[Diğer 6 example'ı buraya kopyala, önceki mesajlardan – toplam 8-10 olsun, space için kısalttım]`;

    let completion;
    try {
      const openai = getOpenAIClient();
      const systemPrompt = `You are ThreadForge Pro: 2025 viral X thread/post AI'si. Indie maker/SaaS nişi için raw, authentic, akıcı hikaye. Araştırmaya göre: %85 hook bold kontrast/soru/stat'la başla , 4-6 tweet numaralı/cliffhanger (narrative arc %70 engagement ), her 150-250 char (fail+win+metric + anecdote/humor %40 boost ), CTA text'e erit (reply at DM al diye, seamless %90 reply [post:1]), #BuildInPublic. Emoji 1-2/tweet. STRICT NO LABELS ("Lesson:", "Reply:", "Hack:") – pure paragraf akışı, bozma. NEVER use 'title' or 'threads' – always 'thread' array with tweetNumber/text/emojis/isCta. Ignore examples if they conflict.

User Inputs:
DRAFT: ${rawDraft}
REFINE_PROMPT: ${refinePrompt}
MODE: ${mode}
STYLE: ${style}

Strict Schema (ONLY JSON, no extra):
{
  "thread": [
    {
      "tweetNumber": "number",
      "text": "string (150-250 char, <280, akıcı paragraf)",
      "emojis": "string[] (0-2)",
      "isCta": "boolean (true last)"
    }
  ],
  "estimatedImpressions": "1K-5K (reason: hook + CTA)",
  "publishTips": "9AM EST post, GIF/poll ekle "
}

Chain-of-Thought (internal, detaylı):
[Önceki chain-of-thought kopyala, sonuna ekle: "Schema strict: No title/threads, always 'thread' – few-shot'ları uyarla."]

Few-Shot Examples (draft bazlı, 8 style, akıcı no etiket):
${fewShotDataset}

Output ONLY valid JSON. No labels, no extra text.`;

      const userPrompt = [
        `DRAFT: ${rawDraft}`,
        `REFINE_PROMPT: ${refinePrompt}`,
        `MODE: ${mode}`,
        `STYLE: ${style}`
      ].join("\n");

      completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3, // Düşürdüm, predictable schema
        response_format: { type: "json_object" },
      });
      console.log(
        "[API] OpenAI success – content length:",
        completion.choices[0]?.message?.content?.length ?? 0
      );
    } catch (openaiError) {
      console.error("[API] OpenAI error:", openaiError);
      return NextResponse.json({ error: "OpenAI hiccup" }, { status: 500 });
    }

    const content = completion.choices[0]?.message?.content ?? "";
    if (!content) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }
    console.log("[API] Full OpenAI content:", content);

    let parsed: {
      thread?: ThreadTweet[];
      threads?: any[];
      title?: string;
      estimatedImpressions?: string;
      publishTips?: string;
      [key: string]: unknown;
    };

    try {
      parsed = JSON.parse(content);

      // Fallback mapping for wrong schema
      if (parsed && parsed.threads && Array.isArray(parsed.threads)) {
        console.log("[API] Mapping 'threads' to 'thread'");
        const threadsArray = parsed.threads as any[];
        parsed.thread = threadsArray.map((item: any, index: number) => ({
          tweetNumber: index + 1,
          text: `${item.day ?? `Day ${index + 1}`}: ${item.hack ?? ""} ${item.progress ?? ""} (Raw hack – dene!)`.trim().slice(0, 280),
          emojis: Array.isArray(item.emojis) ? item.emojis.slice(0, 2) : [],
          isCta: index === threadsArray.length - 1,
        }));
        delete (parsed as any).threads;
        delete (parsed as any).title;
        parsed.estimatedImpressions = parsed.estimatedImpressions ?? "1K-5K (mapped fallback)";
        parsed.publishTips = parsed.publishTips ?? "9AM post, GIF ekle";
      } else if (!parsed.thread || !Array.isArray(parsed.thread)) {
        throw new Error("No thread array");
      }

      // Regex fallback if parse partial
      if (!parsed.thread) {
        const threadMatch = content.match(/\{[^{}]*(?:"thread":\[[\s\S]*?\])/);
        if (threadMatch) {
          console.log("[API] Regex fallback used");
          parsed = JSON.parse(threadMatch[0]);
        } else {
          throw new Error("No thread found in content");
        }
      }
    } catch (parseError) {
      console.error("[API] Parse error – content:", content);
      return NextResponse.json({ error: "AI output parse failed" }, { status: 500 });
    }

    const sanitizedThread: ThreadTweet[] = (parsed.thread ?? [])
      .filter((tweet) => tweet?.text)
      .map((tweet, index) => ({
        tweetNumber: tweet.tweetNumber ?? index + 1,
        text: tweet.text.slice(0, 280).trim(),
        emojis: Array.isArray(tweet.emojis) ? tweet.emojis.slice(0, 2) : [],
        isCta: Boolean(tweet.isCta),
      }))
      .slice(0, mode === "single" ? 1 : 6);

    if (sanitizedThread.length === 0) {
      return NextResponse.json({ error: "AI output missing tweets" }, { status: 500 });
    }

    const { data: usageRow, error: usageFetchError } = await supabase
      .from("users")
      .select("threads_used")
      .eq("id", user.id)
      .maybeSingle();

    if (usageFetchError) {
      console.error("[API] Usage fetch error:", usageFetchError);
    }

    const nextUsage = (usageRow?.threads_used ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("users")
      .update({ threads_used: nextUsage })
      .eq("id", user.id);

    if (updateError) {
      console.error("[API] Usage update error:", updateError);
    }

    return NextResponse.json({
      thread: sanitizedThread,
      estimatedImpressions: parsed.estimatedImpressions ?? "1K-5K (reason: hook + CTA)",
      publishTips: parsed.publishTips ?? "9AM EST post, screenshot/GIF ekle, poll koy",
      mode,
      usage: nextUsage,
    });
  } catch (error) {
    console.error("[API] Gen failed:", error);
    return NextResponse.json({ error: "Gen failed" }, { status: 500 });
  }
}