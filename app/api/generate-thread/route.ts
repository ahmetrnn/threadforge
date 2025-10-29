import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { getOpenAIClient } from "@/lib/openai";
import { getXAIClient, GROK_MODELS } from "@/lib/xai";
import { getGeminiClient, GEMINI_MODELS, getGroundingTool, shouldUseGrounding, extractGroundingSources } from "@/lib/gemini";
import type { ThreadMode, ThreadTweet, GroundingSource } from "@/types/thread";
import systemPrompt from "@/lib/prompts/system-prompt";
import systemPromptTurkish from "@/lib/prompts/system-prompt-turkish";
import flexibleSystemPrompt from "@/lib/prompts/flexible-system-prompt";
import flexibleSystemPromptTurkish from "@/lib/prompts/flexible-system-prompt-turkish";
import { fewShotExamples } from "@/lib/prompts/few-shot-examples";
import { fewShotExamplesTurkish } from "@/lib/prompts/few-shot-examples-turkish";
import flexibleFewShotExamples from "@/lib/prompts/flexible-few-shot-examples";
import { validateThreadQuality, getImprovementSuggestions } from "@/lib/prompts/quality-validator";

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

    // Support both old and new parameter formats for backward compatibility
    const rawTopic = typeof body.topic === "string" ? body.topic.trim() : (typeof body.draft === "string" ? body.draft.trim() : "");
    const rawThreadType = typeof body.threadType === "string" ? body.threadType.trim() : (typeof body.style === "string" ? body.style.trim() : "");
    const rawTone = typeof body.tone === "string" ? body.tone.trim() : (typeof body.refinePrompt === "string" ? body.refinePrompt.trim() : "");
    const rawMode = body.mode as ThreadMode | undefined;
    const rawLanguage = typeof body.language === "string" ? body.language.trim() : "en";
    const threadLength = typeof body.threadLength === "number" ? Math.min(Math.max(body.threadLength, 4), 6) : 6; // Default 6, clamp 4-6
    const isHighQuality = typeof body.isHighQuality === "boolean" ? body.isHighQuality : false;

    if (!rawTopic) {
      const errorMsg = rawLanguage === "tr" ? "Konu gerekli" : "Topic required";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const mode: ThreadMode = rawMode === "single" ? "single" : "thread";
    const language = rawLanguage === "tr" ? "tr" : "en";

    // Get user subscription status for Pro features
    const { data: userData } = await supabase
      .from("users")
      .select("subscription_status, threads_used")
      .eq("auth_user_id", user.id)
      .single();

    const isPro = userData?.subscription_status === "pro";
    const maxSinglePostLength = isPro ? 4000 : 280; // Pro users get longer posts

    // Map old style names to new thread types
    const styleToThreadTypeMap: Record<string, string> = {
      "raw": "vulnerability",
      "narrative": "vulnerability",
      "funny": "vulnerability",
      "inspirational": "journey",
      "data-driven": "data-driven",
      "listicle": "data-driven",
      "teaser": "quick-win",
      "question-based": "contrarian",
    };

    const threadType = rawThreadType ? (styleToThreadTypeMap[rawThreadType] || rawThreadType) : "none"; // Default to flexible mode
    const tone = rawTone;

    // Determine if we're using flexible or template-based generation
    const isFlexibleMode = !threadType || threadType === "none" || threadType === "";

    // Select prompts based on mode and language
    let selectedSystemPrompt: string;
    let selectedExamples: string;

    if (isFlexibleMode) {
      // Flexible prompt-based generation
      selectedSystemPrompt = language === "tr" ? flexibleSystemPromptTurkish : flexibleSystemPrompt;
      selectedExamples = flexibleFewShotExamples; // English examples work for both languages as reference
    } else {
      // Template-based generation (backward compatibility)
      selectedSystemPrompt = language === "tr" ? systemPromptTurkish : systemPrompt;
      selectedExamples = language === "tr" ? fewShotExamplesTurkish : fewShotExamples;
    }

    // Determine if we should use grounding for this request
    const useGrounding = shouldUseGrounding(rawTopic, threadType);
    console.log("[API] Use grounding:", useGrounding, "for topic:", rawTopic.slice(0, 50));

    let content: string = "";
    let groundingSources: GroundingSource[] = [];

    try {
      console.log("[API] Initializing Gemini client...");
      const gemini = getGeminiClient();
      console.log("[API] Gemini client initialized successfully");

      // Build comprehensive system prompt with examples (language-specific)
      const examplesHeader = language === "tr"
        ? "## ÖRNEKLERİ İNCELE\nKalite standardını anlamak için bu örnekleri incele. Hook'lara, kırılganlığa, spesifik metriklere ve hikaye anlatımına dikkat et:"
        : "## FEW-SHOT EXAMPLES\nStudy these examples to understand the quality bar. Notice the hooks, vulnerability, specific metrics, and storytelling:";

      // Enhanced quality enforcement
      const qualityEnforcement = language === "tr"
        ? "\n\n## KALİTE KONTROLÜ (ZORUNLU)\n- Hook: Cesur ifade + gerilim + twist + kanıt (zorunlu)\n- En az 3 spesifik sayı/metrik (zorunlu)\n- Kırılganlık: Başarısızlık, şüphe, kayıp (zorunlu)\n- Hikaye akışı: Etiket yok, doğal anlatım (zorunlu)\n- CTA: Doğal, değer sunan (zorunlu)\n- Tweet'ler 150-240 karakter (zorunlu)"
        : "\n\n## QUALITY ENFORCEMENT (MANDATORY)\n- Hook: Bold statement + tension + twist + proof (required)\n- At least 3 specific numbers/metrics (required)\n- Vulnerability: Failure, doubt, loss (required)\n- Storytelling flow: No labels, natural narrative (required)\n- CTA: Natural, offers value (required)\n- Tweets 150-240 characters (required)";
      const highQualityPrompt = isHighQuality
        ? language === "tr"
          ? `

## 🔥 YÜKSEK KALİTE MODU AKTİF - MİNİMUM 85 PUAN HEDEF 🔥

### ÇOK KRİTİK - HOOK KURALLARI (30 PUAN):
✓ İLK 10 KELİMEDE mutlaka bir sayı olmalı (örn: "$12K kaybettim", "3 yılda 0 müşteri")
✓ Açık acı/mücadele göster (örn: "başarısız oldum", "her şeyi kaybettim", "aptal gibiydim")
✓ Beklenmedik twist ekle (örn: "ama sonra...", "ta ki...", "ardından her şey değişti")
✓ Kanıt/sonuç ver (örn: "şimdi $50K/ay", "10K kullanıcı", "%300 büyüme")
✓ KÖTÜ ÖRNEK: "SaaS yapmayı öğrendim" ❌
✓ İYİ ÖRNEK: "$140K maaşı terk ettim, 8 ay iflas ettim, sonra 3 satır kod her şeyi değiştirdi. Şimdi $80K/ay" ✅

### SAYILAR - ZORUNLU (20 PUAN):
✓ EN AZ 5 spesifik metrik kullan (3 değil, 5+!)
✓ Para ($12K, $140K, $2M gibi)
✓ Yüzdeler (%300 artış, %15 dönüşüm, %0.5 tıklama)
✓ Kullanıcı sayıları (0→10K, 47 test, 1000 MRR)
✓ Zaman (3 yıl, 60 gün, 4 saat, 27 dakika)
✓ Her tweette en az 1 sayı olmalı

### KIRILGANLIK - ZORUNLU (15 PUAN):
✓ Gerçek başarısızlıkları paylaş ("$12K kaybettim", "müşterim yoktu", "aptal gibiydim")
✓ Şüphe ve korku göster ("vazgeçmeyi düşündüm", "bitti sanıyordum")
✓ Utanç verici anları ekle ("3 ay evsizliğin eşiğindeydim")
✓ Jenerasyonlu ifadeler YASAK: "zorluklar yaşadım" ❌ → "tüm birikimimi kaybettim" ✅

### CTA - ÇOK GÜÇLÜ OLMALI (15 PUAN):
✓ Son tweet'te net bir eylem çağrısı
✓ Değer teklifi sun ("DM at, tam roadmap'i gönderirim", "Reply yaz, 5 yıllık stratejimi paylaşırım")
✓ Soruyla bitir ("Hangi bölüm seni en çok şaşırttı?", "Sen hangi hatayı yaptın?")
✓ KÖTÜ: "Beğendiysen RT" ❌
✓ İYİ: "Aynı hatayı yapıyorsan DM at, $50K kurtarabilirsin" ✅

### AKIŞ - DOĞAL HİKAYE (10 PUAN):
✓ "1/" "2/" gibi etiketler YASAK
✓ Tweet'ler arası doğal geçişler ("Ama asıl sorun şuydu:", "İşte o zaman anladım:")
✓ Hikaye akışı: Sorun → Mücadele → Çözüm → Sonuç
✓ Her tweet önceki tweet'e bağlı olmalı

### TWEET UZUNLUKLARI:
✓ 150-240 karakter arası (çok kısa veya çok uzun değil)
✓ İlk tweet: 200-240 karakter (hook maksimum etki için)
✓ Son tweet: 180-220 karakter (CTA için yer)

### KALİTE KONTROL LİSTESİ:
✅ Hook'ta sayı var mı?
✅ Hook'ta acı/başarısızlık var mı?
✅ Hook'ta twist var mı?
✅ Toplam 5+ spesifik sayı var mı?
✅ Gerçek kırılganlık paylaşıldı mı?
✅ CTA değer sunuyor mu?
✅ Tweet'ler doğal akıyor mu?

BU KURALLARIN HEPSİNE UYMALISIN - HEDEF MİNİMUM 85 PUAN!`
          : `

## 🔥 HIGH QUALITY MODE ACTIVATED - TARGET MINIMUM 85 SCORE 🔥

### SUPER CRITICAL - HOOK RULES (30 POINTS):
✓ FIRST 10 WORDS must include a number (e.g., "I lost $12K", "3 years, 0 customers")
✓ Show clear pain/struggle (e.g., "I failed", "I lost everything", "I was an idiot")
✓ Add unexpected twist (e.g., "but then...", "until...", "then everything changed")
✓ Include proof/result (e.g., "now $50K/mo", "10K users", "300% growth")
✓ BAD EXAMPLE: "I learned to build SaaS" ❌
✓ GOOD EXAMPLE: "Quit my $140K job, went broke for 8 months, then 3 lines of code changed everything. Now $80K/mo" ✅

### NUMBERS - MANDATORY (20 POINTS):
✓ Use AT LEAST 5 specific metrics (not 3, but 5+!)
✓ Money ($12K, $140K, $2M format)
✓ Percentages (300% growth, 15% conversion, 0.5% CTR)
✓ User counts (0→10K, tested 47 tactics, 1000 MRR)
✓ Time (3 years, 60 days, 4 hours, 27 minutes)
✓ Every tweet should have at least 1 number

### VULNERABILITY - MANDATORY (15 POINTS):
✓ Share real failures ("lost $12K", "had zero customers", "I was stupid")
✓ Show doubt and fear ("thought about quitting", "felt it was over")
✓ Include embarrassing moments ("was on the edge of homelessness for 3 months")
✓ Generic phrases FORBIDDEN: "faced challenges" ❌ → "lost my entire savings" ✅

### CTA - MUST BE VERY STRONG (15 POINTS):
✓ Clear action in final tweet
✓ Offer value ("DM me, I'll send the full roadmap", "Reply and I'll share my 5-year strategy")
✓ End with question ("Which part surprised you most?", "What mistake did you make?")
✓ BAD: "RT if you liked this" ❌
✓ GOOD: "Making this mistake? DM me, I can save you $50K" ✅

### FLOW - NATURAL STORYTELLING (10 POINTS):
✓ NO labels like "1/" "2/"
✓ Natural transitions between tweets ("But here's the real problem:", "That's when I realized:")
✓ Story flow: Problem → Struggle → Solution → Result
✓ Each tweet must connect to previous tweet

### TWEET LENGTHS:
✓ 150-240 characters (not too short or too long)
✓ First tweet: 200-240 chars (hook needs maximum impact)
✓ Last tweet: 180-220 chars (room for CTA)

### QUALITY CHECKLIST:
✅ Does hook have a number?
✅ Does hook show pain/failure?
✅ Does hook have a twist?
✅ Are there 5+ specific numbers total?
✅ Is real vulnerability shared?
✅ Does CTA offer value?
✅ Do tweets flow naturally?

YOU MUST FOLLOW ALL THESE RULES - TARGET MINIMUM 85 POINTS!`
        : "";

      const fullSystemPrompt = `${selectedSystemPrompt}

${examplesHeader}

${selectedExamples}

---

${language === "tr" ? "Şimdi aşağıdaki kullanıcı girdisi için thread oluştur. Yukarıdaki örneklerin kalitesini ve samimiyetini yakala." : "Now generate a thread for the user's input below. Match the quality and authenticity of the examples above."}${qualityEnforcement}${highQualityPrompt}`;

      // Build user prompt based on mode (flexible vs template)
      let userPrompt: string;

      if (isFlexibleMode) {
        // Flexible mode: User instruction is the prompt
        userPrompt = language === "tr"
          ? `Kullanıcı Talimatı: ${rawTopic}

MOD: ${mode === "single" ? "Tek post" : `Thread (${threadLength} tweet)`}
${mode === "single" && maxSinglePostLength > 280 ? `MAKSIMUM UZUNLUK: ${maxSinglePostLength} karakter (Pro özellik)` : ""}
${tone ? `TON MODİFİKATÖRÜ: ${tone}` : ""}
DİL: Türkçe

ÇOK ÖNEMLİ: Tüm thread'i TÜRKÇE olarak yaz. Her tweet TÜRKÇE olmalı.

Kullanıcının talimatını yorumla ve ${mode === "single" ? "tek post" : `tam ${threadLength} tweetlik thread`} oluştur.
${mode === "thread" ? `TAM ${threadLength} tweet oluştur (daha fazla değil, daha az değil).` : ""}
SADECE geçerli JSON çıktısı ver.`
          : `User Instruction: ${rawTopic}

MODE: ${mode === "single" ? "Single post" : `Thread (${threadLength} tweets)`}
${mode === "single" && maxSinglePostLength > 280 ? `MAX LENGTH: ${maxSinglePostLength} characters (Pro feature)` : ""}
${tone ? `TONE MODIFIER: ${tone}` : ""}
LANGUAGE: English

VERY IMPORTANT: Write the entire thread in ENGLISH. Every tweet must be in ENGLISH.

Interpret the user's instruction and create ${mode === "single" ? "a single post" : `a ${threadLength}-tweet thread`}.
${mode === "thread" ? `Generate EXACTLY ${threadLength} tweets (no more, no less).` : ""}
Output ONLY valid JSON.`;
      } else {
        // Template mode: Traditional structured approach
        userPrompt = language === "tr"
          ? `Şu bilgilere göre viral ${mode === "single" ? "tek post" : "thread"} oluştur:

KONU: ${rawTopic}
THREAD TİPİ: ${threadType}
${tone ? `TON: ${tone}` : ""}
MOD: ${mode}
${mode === "thread" ? `TWEET SAYISI: TAM ${threadLength} tweet oluştur (daha fazla değil, daha az değil)` : ""}
${mode === "single" && maxSinglePostLength > 280 ? `MAKSIMUM UZUNLUK: ${maxSinglePostLength} karakter (Pro özellik - daha uzun, derinlemesine post yazabilirsin)` : ""}
DİL: Türkçe

ÇOK ÖNEMLİ: Tüm thread'i TÜRKÇE olarak yaz. Her tweet TÜRKÇE olmalı.

Unutma:
- GÜÇLÜ hook ile başla (cesur + gerilim + twist + kanıt)
- Spesifik sayılar ve metrikler ekle
- Sadece kazançları değil, kırılganlığı ve mücadeleyi göster
- Jenerik ipuçları değil, hikaye anlatımı kullan
${mode === "single" && maxSinglePostLength > 280 ? `- Uzun post için: derinlemesine hikaye, çoklu nokta, detaylı içgörü ekle` : "- Tweet'leri 150-240 karakter tut"}
${mode === "thread" ? `- TAM ${threadLength} tweet oluştur` : ""}
- Değer sunan doğal CTA
- SADECE geçerli JSON çıktısı ver`
          : `Generate a viral ${mode === "single" ? "single post" : "thread"} based on:

TOPIC: ${rawTopic}
THREAD TYPE: ${threadType}
${tone ? `TONE: ${tone}` : ""}
MODE: ${mode}
${mode === "thread" ? `TWEET COUNT: Generate EXACTLY ${threadLength} tweets (no more, no less)` : ""}
${mode === "single" && maxSinglePostLength > 280 ? `MAX LENGTH: ${maxSinglePostLength} characters (Pro feature - write longer, in-depth post)` : ""}
LANGUAGE: English

VERY IMPORTANT: Write the entire thread in ENGLISH. Every tweet must be in ENGLISH.

Remember:
- Start with a POWERFUL hook (bold + tension + twist + proof)
- Include specific numbers and metrics
- Show vulnerability and struggle, not just wins
- Use storytelling, not generic tips
${mode === "single" && maxSinglePostLength > 280 ? `- For long post: deep storytelling, multiple points, detailed insights` : "- Keep tweets 150-240 characters"}
${mode === "thread" ? `- Generate EXACTLY ${threadLength} tweets` : ""}
- Natural CTA that offers value
- Output ONLY valid JSON matching the schema`;
      }

      // Configure Gemini with optional grounding
      // NOTE: Cannot use tools (grounding) with JSON response mime type
      const config: any = {
        temperature: 0.75,
        maxOutputTokens: 4000, // Increased from 2000 to prevent truncation
        responseMimeType: "application/json",
      };

      // Grounding is disabled due to JSON response type requirement
      // This is a known limitation: tools cannot be used with JSON responseMimeType
      if (useGrounding) {
        console.log("[API] Grounding requested but disabled due to JSON response type requirement");
      }

      console.log("[API] Preparing Gemini request with config:", {
        model: GEMINI_MODELS.GEMINI_2_5_PRO,
        useGrounding,
        temperature: config.temperature,
        maxOutputTokens: config.maxOutputTokens,
        responseMimeType: config.responseMimeType,
        promptLength: `${fullSystemPrompt}\n\n${userPrompt}`.length
      });

      const response = await gemini.models.generateContent({
        model: GEMINI_MODELS.GEMINI_2_5_PRO,
        contents: `${fullSystemPrompt}\n\n${userPrompt}`,
        config,
      });

      console.log("[API] Gemini API call completed, checking response...");
      console.log("[API] Response object keys:", Object.keys(response));
      console.log("[API] Response candidates count:", response.candidates?.length || 0);

      // Handle potential streaming/chunked response
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        console.log("[API] Candidate finish reason:", candidate.finishReason);
        console.log("[API] Candidate has content:", !!candidate.content);
        if (candidate.content) {
          console.log("[API] Content parts count:", candidate.content.parts?.length || 0);
          // Concatenate all parts if multiple
          content = candidate.content.parts?.map(part => part.text || "").join("") || "";
        }
      } else {
        content = response.text || "";
      }

      console.log("[API] Full content length:", content.length);
      console.log("[API] Content preview (first 500 chars):", content.substring(0, 500));
      console.log("[API] Content preview (last 500 chars):", content.substring(Math.max(0, content.length - 500)));

      if (!content) {
        console.error("[API] Gemini returned empty response");
        throw new Error("Empty response from Gemini API");
      }

      // Extract grounding sources if available
      // Grounding metadata is on the first candidate
      if (useGrounding && response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0];
        if ((candidate as any).groundingMetadata) {
          groundingSources = extractGroundingSources((candidate as any).groundingMetadata).map(s => ({...s, text: ''}));
          console.log("[API] Grounding sources found:", groundingSources.length);
        }
      }

      console.log(
        "[API] Gemini 2.5 Pro success – content length:",
        content.length,
        "grounded:",
        useGrounding
      );
    } catch (geminiError) {
      console.error("[API] Gemini error details:", {
        error: geminiError,
        message: geminiError instanceof Error ? geminiError.message : 'Unknown error',
        stack: geminiError instanceof Error ? geminiError.stack : undefined,
        name: geminiError instanceof Error ? geminiError.constructor.name : 'Unknown'
      });

      // Try fallback to OpenAI if Gemini fails
      console.log("[API] Attempting fallback to OpenAI...");
      try {
        const openai = getOpenAIClient();
        const fallbackResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: selectedSystemPrompt },
            { role: "user", content: `${selectedExamples}\n\n---\n\n${language === "tr" ? "Şimdi aşağıdaki kullanıcı girdisi için thread oluştur. Yukarıdaki örneklerin kalitesini ve samimiyetini yakala." : "Now generate a thread for the user's input below. Match the quality and authenticity of the examples above."}\n\n${rawTopic}` }
          ],
          temperature: 0.75,
          max_tokens: 4000,
          response_format: { type: "json_object" }
        });

        content = fallbackResponse.choices[0]?.message?.content || "";
        console.log("[API] OpenAI fallback success – content length:", content.length);

        if (!content) {
          throw new Error("Empty OpenAI response");
        }
      } catch (openaiError) {
        console.error("[API] OpenAI fallback also failed:", openaiError);
        return NextResponse.json({ error: "AI generation failed - both Gemini and OpenAI unavailable" }, { status: 500 });
      }
    }

    if (!content) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }
    console.log("[API] Gemini content:", content.slice(0, 200));

    let parsed: {
      thread?: ThreadTweet[];
      threads?: any[];
      title?: string;
      estimatedImpressions?: string;
      publishTips?: string;
      [key: string]: unknown;
    };

    console.log("[API] Raw AI content before parsing:", content);
    console.log("[API] Content length:", content.length);
    console.log("[API] Content starts with '{':", content.trim().startsWith('{'));
    console.log("[API] Content ends with '}':", content.trim().endsWith('}'));

    try {
      // First try direct JSON parse
      console.log("[API] Attempting direct JSON parse...");
      parsed = JSON.parse(content);
      console.log("[API] Direct JSON parse successful. Parsed keys:", Object.keys(parsed));
      console.log("[API] Parsed thread exists:", !!parsed.thread);
      console.log("[API] Parsed thread type:", Array.isArray(parsed.thread) ? "array" : typeof parsed.thread);
      console.log("[API] Parsed thread length:", Array.isArray(parsed.thread) ? parsed.thread.length : "N/A");
    } catch (parseError) {
      console.log("[API] Direct JSON parse failed, attempting recovery...");
      console.log("[API] Parse error details:", parseError instanceof Error ? parseError.message : String(parseError));

      // Check if content is truncated (starts with { but doesn't end with })
      const trimmedContent = content.trim();
      console.log("[API] Trimmed content length:", trimmedContent.length);
      console.log("[API] Starts with '{':", trimmedContent.startsWith('{'));
      console.log("[API] Ends with '}':", trimmedContent.endsWith('}'));

      if (trimmedContent.startsWith('{') && !trimmedContent.endsWith('}')) {
        console.log("[API] Detected truncated JSON response, attempting to fix...");

        // Try to find the last complete JSON object by finding balanced braces
        let braceCount = 0;
        let lastValidIndex = -1;

        for (let i = 0; i < trimmedContent.length; i++) {
          if (trimmedContent[i] === '{') braceCount++;
          else if (trimmedContent[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              lastValidIndex = i;
            }
          }
        }

        console.log("[API] Brace analysis - last valid index:", lastValidIndex, "brace count at end:", braceCount);

        if (lastValidIndex > 0) {
          const fixedContent = trimmedContent.substring(0, lastValidIndex + 1);
          console.log("[API] Attempting to parse truncated content (length:", fixedContent.length, ")");
          try {
            parsed = JSON.parse(fixedContent);
            console.log("[API] Successfully recovered from truncated JSON");
          } catch (recoveryError) {
            console.error("[API] Recovery failed:", recoveryError instanceof Error ? recoveryError.message : String(recoveryError));
            throw parseError; // Re-throw original error
          }
        } else {
          console.log("[API] No valid JSON structure found in truncated content");
          throw parseError; // No valid JSON structure found
        }
      } else {
        // Try regex fallback for other malformed cases
        const threadMatch = content.match(/\{[^{}]*(?:"thread":\[[\s\S]*?\])/);
        if (threadMatch) {
          console.log("[API] Regex fallback used, match length:", threadMatch[0].length);
          try {
            parsed = JSON.parse(threadMatch[0]);
          } catch (regexError) {
            console.error("[API] Regex fallback also failed:", regexError instanceof Error ? regexError.message : String(regexError));
            throw parseError;
          }
        } else {
          console.log("[API] No regex match found for thread structure");
          throw parseError;
        }
      }
    }

    // Fallback mapping for wrong schema
    if (parsed && parsed.threads && Array.isArray(parsed.threads)) {
      console.log("[API] Mapping 'threads' to 'thread'");
      const threadsArray = parsed.threads as any[];
      parsed.thread = threadsArray.map((item: any, index: number) => ({
        id: index,
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

    let sanitizedThread: ThreadTweet[] = (parsed.thread ?? [])
      .filter((tweet) => tweet?.text)
      .map((tweet, index) => ({
        id: index,
        tweetNumber: tweet.tweetNumber ?? index + 1,
        text: tweet.text.slice(0, mode === "single" ? maxSinglePostLength : 280).trim(),
        emojis: Array.isArray(tweet.emojis) ? tweet.emojis.slice(0, 2) : [],
        isCta: Boolean(tweet.isCta),
      }))
      .slice(0, mode === "single" ? 1 : threadLength);

    console.log("[API] Thread sanitization complete:");
    console.log("[API] Original parsed thread length:", Array.isArray(parsed.thread) ? parsed.thread.length : "N/A");
    console.log("[API] Sanitized thread length:", sanitizedThread.length);
    console.log("[API] Expected thread length:", mode === "single" ? 1 : threadLength);
    console.log("[API] First tweet preview:", sanitizedThread[0]?.text?.substring(0, 100) || "No first tweet");
    console.log("[API] Last tweet preview:", sanitizedThread[sanitizedThread.length - 1]?.text?.substring(0, 100) || "No last tweet");

    if (sanitizedThread.length === 0) {
      return NextResponse.json({ error: "AI output missing tweets" }, { status: 500 });
    }

    // Validate thread quality
    const qualityReport = validateThreadQuality(sanitizedThread, mode);
    console.log("[API] Quality report:", {
      score: qualityReport.score,
      isValid: qualityReport.isValid,
      issues: qualityReport.issues.length,
    });

    // Log quality issues for monitoring
    if (!qualityReport.isValid) {
      console.warn("[API] Quality issues:", qualityReport.issues);
      console.warn("[API] Suggestions:", getImprovementSuggestions(qualityReport));
    }

    // If quality is low, try to regenerate with more specific instructions
    if (qualityReport.score < 60) {
      console.log("[API] Quality below 60, attempting regeneration with enhanced prompt...");

      const enhancedUserPrompt = language === "tr"
        ? `${rawTopic}

MOD: ${mode === "single" ? "Tek post" : `Thread (${threadLength} tweet)`}
${mode === "single" && maxSinglePostLength > 280 ? `MAKSIMUM UZUNLUK: ${maxSinglePostLength} karakter (Pro özellik)` : ""}
${tone ? `TON MODİFİKATÖRÜ: ${tone}` : ""}
DİL: Türkçe

ÖNCEKİ DENEME KALİTESİ ÇOK DÜŞÜK (${qualityReport.score}/100). LÜTFEN BU HATALARI DÜZELT:
${qualityReport.issues.map(i => `- ${i.message}`).join('\n')}

Kullanıcının talimatını yorumla ve ${mode === "single" ? "tek post" : `tam ${threadLength} tweetlik thread`} oluştur.
${mode === "thread" ? `TAM ${threadLength} tweet oluştur (daha fazla değil, daha az değil).` : ""}
SADECE geçerli JSON çıktısı ver.`
        : `${rawTopic}

MODE: ${mode === "single" ? "Single post" : `Thread (${threadLength} tweets)`}
${mode === "single" && maxSinglePostLength > 280 ? `MAX LENGTH: ${maxSinglePostLength} characters (Pro feature)` : ""}
${tone ? `TONE MODIFIER: ${tone}` : ""}
LANGUAGE: English

PREVIOUS ATTEMPT QUALITY TOO LOW (${qualityReport.score}/100). PLEASE FIX THESE ISSUES:
${qualityReport.issues.map(i => `- ${i.message}`).join('\n')}

Interpret the user's instruction and create ${mode === "single" ? "a single post" : `a ${threadLength}-tweet thread`}.
${mode === "thread" ? `Generate EXACTLY ${threadLength} tweets (no more, no less).` : ""}
Output ONLY valid JSON.`;

      try {
        const retryGemini = getGeminiClient();
        const retryConfig: any = {
          temperature: 0.8, // Slightly higher temperature for retry
          maxOutputTokens: 4000, // Increased from 2000 to prevent truncation
          responseMimeType: "application/json",
        };

        const retryResponse = await retryGemini.models.generateContent({
          model: GEMINI_MODELS.GEMINI_2_5_PRO,
          contents: `${selectedSystemPrompt}\n\n${selectedExamples}\n\n---\n\n${language === "tr" ? "Şimdi aşağıdaki kullanıcı girdisi için thread oluştur. Yukarıdaki örneklerin kalitesini ve samimiyetini yakala." : "Now generate a thread for the user's input below. Match the quality and authenticity of the examples above."}${language === "tr" ? "\n\n## KALİTE KONTROLÜ (ZORUNLU)\n- Hook: Cesur ifade + gerilim + twist + kanıt (zorunlu)\n- En az 3 spesifik sayı/metrik (zorunlu)\n- Kırılganlık: Başarısızlık, şüphe, kayıp (zorunlu)\n- Hikaye akışı: Etiket yok, doğal anlatım (zorunlu)\n- CTA: Doğal, değer sunan (zorunlu)\n- Tweet'ler 150-240 karakter (zorunlu)" : "\n\n## QUALITY ENFORCEMENT (MANDATORY)\n- Hook: Bold statement + tension + twist + proof (required)\n- At least 3 specific numbers/metrics (required)\n- Vulnerability: Failure, doubt, loss (required)\n- Storytelling flow: No labels, natural narrative (required)\n- CTA: Natural, offers value (required)\n- Tweets 150-240 characters (required)"}\n\n${enhancedUserPrompt}`,
          config: retryConfig,
        });

        const retryContent = retryResponse.text || "";
        if (retryContent) {
          const retryParsed = JSON.parse(retryContent);
          if (retryParsed.thread && Array.isArray(retryParsed.thread)) {
            let retrySanitizedThread: ThreadTweet[] = retryParsed.thread
              .filter((tweet: any) => tweet?.text)
              .map((tweet: any, index: number) => ({
                id: index,
                tweetNumber: tweet.tweetNumber ?? index + 1,
                text: tweet.text.slice(0, mode === "single" ? maxSinglePostLength : 280).trim(),
                emojis: Array.isArray(tweet.emojis) ? tweet.emojis.slice(0, 2) : [],
                isCta: Boolean(tweet.isCta),
              }))
              .slice(0, mode === "single" ? 1 : threadLength);

            const retryQualityReport = validateThreadQuality(retrySanitizedThread, mode);
            if (retryQualityReport.score > qualityReport.score) {
              console.log(`[API] Retry successful - improved from ${qualityReport.score} to ${retryQualityReport.score}`);
              sanitizedThread = retrySanitizedThread;
              parsed.estimatedImpressions = retryParsed.estimatedImpressions ?? parsed.estimatedImpressions;
              parsed.publishTips = retryParsed.publishTips ?? parsed.publishTips;
            }
          }
        }
      } catch (retryError) {
        console.warn("[API] Retry failed, using original:", retryError);
      }
    }

    // For now, return the thread even if quality is low (user can edit)
    // But log it for future improvements to the prompt
    // TODO: In future, we may want to reject very low quality threads entirely

    const nextUsage = (userData?.threads_used ?? 0) + 1;

    console.log("[API] Preparing database operations:");
    console.log("[API] Next usage count:", nextUsage);
    console.log("[API] Thread data length:", sanitizedThread.length);
    console.log("[API] Thread data first tweet:", sanitizedThread[0]?.text?.substring(0, 50) || "No thread data");
    console.log("[API] Quality score:", qualityReport.score);
    console.log("[API] Estimated impressions:", parsed.estimatedImpressions ?? "1K-5K (reason: hook + CTA)");
    console.log("[API] Publish tips:", parsed.publishTips ?? "9AM EST post, screenshot/GIF ekle, poll koy");

    // Update usage count
    const { error: updateError } = await supabase
      .from("users")
      .update({ threads_used: nextUsage })
      .eq("auth_user_id", user.id);

    if (updateError) {
      console.error("[API] Usage update error:", updateError);
    } else {
      console.log("[API] Usage count updated successfully");
    }

    // Save to thread history
    console.log("[API] Inserting into thread_history...");
    const { error: historyError } = await supabase
      .from("thread_history")
      .insert({
        user_id: user.id,
        thread_data: sanitizedThread,
        topic: rawTopic,
        thread_type: threadType,
        tone: tone || null,
        mode,
        language,
        quality_score: qualityReport.score,
        estimated_impressions: parsed.estimatedImpressions ?? "1K-5K (reason: hook + CTA)",
        publish_tips: parsed.publishTips ?? "9AM EST post, screenshot/GIF ekle, poll koy",
        is_posted: false,
      });

    if (historyError) {
      console.error("[API] History save error:", historyError);
      console.error("[API] History save error details:", {
        message: historyError.message,
        details: historyError.details,
        hint: historyError.hint,
        code: historyError.code
      });
    } else {
      console.log("[API] Thread history saved successfully");
    }

    if (historyError) {
      console.error("[API] History save error:", historyError);
      // Don't fail the request if history save fails
    }

    return NextResponse.json({
      thread: sanitizedThread,
      estimatedImpressions: parsed.estimatedImpressions ?? "1K-5K (reason: hook + CTA)",
      publishTips: parsed.publishTips ?? "9AM EST post, screenshot/GIF ekle, poll koy",
      mode,
      usage: nextUsage,
      qualityScore: qualityReport.score,
      sources: groundingSources.length > 0 ? groundingSources : undefined,
      isGrounded: useGrounding && groundingSources.length > 0,
    });
  } catch (error) {
    console.error("[API] Gen failed:", error);
    return NextResponse.json({ error: "Gen failed" }, { status: 500 });
  }
}