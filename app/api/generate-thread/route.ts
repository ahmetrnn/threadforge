import { NextResponse } from "next/server";

import { getOpenAIClient } from "@/lib/openai";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase";
import type { ThreadTweet } from "@/types/thread";

const FREE_LIMIT = 3;

export async function POST(request: Request) {
  try {
    const { topic, vibe, template } = await request.json();

    if (!topic || !vibe || !template) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    const supabase = createSupabaseRouteHandlerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("threads_used, subscription_status")
      .eq("auth_user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error(profileError);
      return NextResponse.json({ message: "Unable to fetch usage." }, { status: 500 });
    }

    const threadsUsed = profile?.threads_used ?? 0;
    const subscriptionStatus = (profile?.subscription_status as "free" | "pro") ?? "free";

    if (subscriptionStatus !== "pro" && threadsUsed >= FREE_LIMIT) {
      return NextResponse.json({ message: "Free limit reached." }, { status: 402 });
    }

    const openai = getOpenAIClient();

    const fewShotDataset = `Dataset: 3 Viral Thread Örneği (Kopyala-Yapıştır App'e)Bunlar, X'ten çektiğim top post'lardan (post:0, post:6, post:8 gibi) derlenmiş. Her biri 6-8 tweet, yüksek engagement için optimize: Hook > Adımlar > Hikaye > CTA. App'inde "examples" array'i olarak sakla, prompt'a feed et.
Örnek 1: "Daily Progress" Template (Viral Tip: Kişisel Hikaye + Adımlar – 1.5M View Potansiyeli)

1/7: Herkes "SaaS'ını sessizce build et" diyor. Ama gerçek? Sessiz build edenler sessizce ölüyor. Ben vibe coding'le bir roadmap çizdim ve 1 haftada 50 signup aldım. İşte kaoslu yolculuğum – sen de dene. 😅

2/7: Adım 1: Hook'u bul. Benimki: "0'dan $1K MRR'ye 30 günde?" İnsanlar reply atıyor, waitlist doluyor. Senin pain point'in ne? (Cliffhanger)

3/7: Adım 2: No-code stack kur (Vercel + Supabase). Kod bilmiyorsan bile 2 saatte MVP deploy. Benim hatam: İlk commit'te auth'u unuttum, 3 saat debug. Ders: Test et erken!

4/7: Adım 3: Build in public yap. X'te daily post: "D3: AI thread gen eklendi [screenshot]". Engagement? 200 like, 10 DM feedback. Transparency = trust.

5/7: Adım 4: Monetize et. Stripe sandbox'la $9/mo pro tier. İlk user: "Bu thread'ler altın!" dedi. MRR hack: Freemium limit koy (3 free thread).

6/7: Twist: Virality skoru ekle (est. impressions). Benim thread'im 2K view aldı – seninkisi? 

7/7: CTA: Bu roadmap'i vibe'ına uydur, X'e post'la. Reply "ROADMAP" de, sana custom template DM'leyeyim. Follow for more chaos. #BuildInPublic
Est. Impressions: 1K-5K | Tips: Sabah 9'da post'la, screenshot ekle.

Örnek 2: "Product Teaser" Template (Viral Tip: Feature List + Örnek – 619 Like'lı Launch Tarzı)

1/6: Indie maker'lar için nihai hack: ThreadForge'la viral X thread'leri 60s'da üret. Ben test ettim, 1 thread'le 300 follow kazandım. İşte breakdown 🧵

2/6: Feature 1: Topic gir (e.g., "SaaS vibe coding"), vibe seç (funny/raw). AI hook üretir: "Vibe coding kaosu: 0'dan MVP'ye [emoji]".

3/6: Feature 2: Template'ler – Daily Progress için: Win > Challenge > Next Step. Örnek: "D1: Repo kurdum, ama auth patladı 😩".

4/6: Feature 3: Emoji + CTA auto-add. Her tweet <280 char, cliffhanger'la bağla. Benim teaser thread'im: 500 impression öngörüsü tuttu!

5/6: Neden diğer tool'lar emme? Basit, $9/mo, X entegrasyonu. Enterprise bloat yok – solo builder için.

6/6: Denemek ister misin? Reply "TEASER" de, free trial link DM. Follow for launch updates. #IndieHacker
Est. Impressions: 800-3K | Tips: Video demo ekle, poll koy (e.g., "Hangi template?").

Örnek 3: "Growth Hack Share" Template (Viral Tip: Kontrast + Flywheel – 1279 Like'lı Taktik Tarzı)

1/8: Çoğu creator X'te $5 payout peşinde kölelik yapıyor. Ben? Vibe coding'le 500K user'lı app'ler build ettim, content otomatik viral. İşte product-content flywheel'im 🧵

2/8: Kontrast: Content slave'ler algoritma kovalıyor. Ben build ediyorum – her commit tweet oluyor. Sonuç? 20K follow organik.

3/8: Adım 1: Build in public. "D5: Thread gen eklendi [GIF]". Fail'leri paylaş: "API key unuttum, 2 saat sleep 😴" – samimiyet engagement'ı 2x yapar.

4/8: Adım 2: Feature'ı thread'e çevir. Yeni analytics? "Est. impressions hesapla – benimki 2K!" diye post'la.

5/8: Adım 3: Öğret. Hata'ndan ders: "MRR hack: Referral ekle". Audience guide olur, feedback loop kapanır.

6/8: Adım 4: Loop'u döndür. İyi product = iyi content > audience > feedback > better product. Sonsuz MRR.

7/8: Twist: Bu flywheel'le $10K MRR'ye çık. Benim app'imde dene.

8/8: Hack'i uygula, sonuçlarını reply at. "FLYWHEEL" de, detaylı guide DM. #SaaSGrowth
Est. Impressions: 2K-10K | Tips: Data screenshot ekle, quote'lanabilir yap.`;

    const systemPrompt = `You are ThreadForge Pro: Viral X thread'leri üreten AI, indie maker'lar için. Amaç: 1M+ view potansiyelli, engagement bombası thread'ler – hook'la yakala, adımlarla value ver, samimi vibe'la akıt, CTA'yla kapat. X trend'lerine göre: Kontrast hook ("Herkes diyor ama..."), 5-8 tweet, numaralı/bullets, cliffhanger'lar, maker jargon (vibe coding, MRR hack, build in public). Emojiler az (1-2/tweet), <280 char/tweet.

User Inputs:
- TOPIC: ${topic}
- VIBE: ${vibe} (funny: chaotic/self-deprecating; inspirational: motivational; raw: honest fails; data-driven: metrics; teaser: mystery build-up)
- TEMPLATE: ${template} (Daily Progress: Win>Challenge>Next; Product Teaser: Features+Example; Growth Hack: Flywheel/Steps)

Step-by-Step (internal think, no output):
1. HOOK: Sert gerçek/kontrast/personal win ile başla (e.g., "Herkes sessiz build diyor, ama ben vibe'la 50 signup aldım").
2. STRUCTURE: 5-8 tweet – numaralı adımlar/bullets, her tweet cliffhanger'la bitir. VIBE infuse: Funny=😅 jokes; Raw=fail hikayesi.
3. VALUE: Educational/story – X viral'larından ilham: Adımlar actionable, metrics ekle (est. impressions).
4. CTA: Son tweet'te reply/DM/follow, app promo (e.g., "Reply 'TEMPLATE' for DM").
5. OPTIMIZE: Authentic maker tone, predict virality (1K-10K based on niche).

Few-Shot Examples:
${fewShotDataset}

Output ONLY JSON:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Full tweet (<280 char)",
      "emojis": ["🚀"],
      "isCta": false
    }
  ],
  "estimatedImpressions": "1K-5K (hook + steps)",
  "publishTips": "9AM post, screenshot ekle, poll koy."
}

Invalid input? {"error": "Topic/vibe/template lazım"}.`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: "Return only valid JSON that matches the schema. No markdown.",
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
      max_output_tokens: 1200,
    });

    const rawOutput = response.output_text ??
      (Array.isArray(response.output)
        ? response.output
            .flatMap((item) =>
              "content" in item && Array.isArray(item.content)
                ? item.content
                    .filter((piece) =>
                      typeof piece === "object" && piece !== null && "type" in piece && piece.type === "output_text" && "text" in piece
                    )
                    .map((piece) => (piece as { text: string }).text)
                : []
            )
            .join("\n")
        : "");

    if (!rawOutput) {
      return NextResponse.json({ message: "AI returned empty response." }, { status: 500 });
    }

    const parsed = JSON.parse(rawOutput) as {
      thread?: ThreadTweet[];
      estimatedImpressions?: string;
      publishTips?: string;
    };

    if (!parsed.thread || !Array.isArray(parsed.thread) || parsed.thread.length === 0) {
      return NextResponse.json({ message: "AI response malformed." }, { status: 500 });
    }

    const sanitizedThread: ThreadTweet[] = parsed.thread
      .filter((tweet) => tweet?.text)
      .map((tweet, index) => ({
        tweetNumber: tweet.tweetNumber ?? index + 1,
        text: tweet.text.slice(0, 280),
        emojis: Array.isArray(tweet.emojis) ? tweet.emojis.slice(0, 5) : [],
        isCta: Boolean(tweet.isCta),
      }))
      .slice(0, 10);

    if (sanitizedThread.length === 0) {
      return NextResponse.json({ message: "AI response missing tweets." }, { status: 500 });
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update({ threads_used: threadsUsed + 1 })
      .eq("auth_user_id", userId)
      .select("threads_used")
      .single();

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "Failed to update usage." }, { status: 500 });
    }

    return NextResponse.json({
      thread: sanitizedThread,
      estimatedImpressions: parsed.estimatedImpressions ?? "500-2K",
      publishTips: parsed.publishTips ?? "Post at 9AM EST",
      usage: updatedProfile.threads_used,
    });
  } catch (error) {
    console.error("generate-thread error", error);
    return NextResponse.json({ message: "Unexpected error." }, { status: 500 });
  }
}
