"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n, useLanguage } from "@/lib/i18n/context";
import { ThreadMode } from "@/types/thread";

type ThreadType = "vulnerability" | "data-driven" | "contrarian" | "journey" | "quick-win" | "case-study" | "listicle" | "tutorial" | "behind-scenes" | "hot-take" | "myth-busting" | "comparison";
type Tone = "casual" | "inspiring" | "educational" | "professional" | "controversial" | "humorous" | "storytelling" | "urgent" | "empathetic";
type Language = "en" | "tr";

interface ThreadInputProps {
  onGenerate: (topic: string, emojis: boolean, hashtags: boolean, isHighQuality?: boolean, language?: string) => void;
  isLoading: boolean;
  mode: "basic" | "advanced";
  isHighQuality?: boolean;
  onHighQualityChange?: (value: boolean) => void;
}

const threadTypes = {
  vulnerability: { emoji: "💔", label: { en: "Vulnerability", tr: "Savunmasızlık" }, desc: { en: "I failed, here's what I learned", tr: "Başarısız oldum, öğrendiklerim" } },
  "data-driven": { emoji: "📊", label: { en: "Data-Driven", tr: "Veri Odaklı" }, desc: { en: "I tested X, here's what worked", tr: "X'i test ettim, işe yarayanlar" } },
  contrarian: { emoji: "🎯", label: { en: "Contrarian", tr: "Karşı Görüşlü" }, desc: { en: "Everyone says X, but actually Y", tr: "Herkes X diyor ama aslında Y" } },
  journey: { emoji: "📖", label: { en: "Journey", tr: "Yolculuk" }, desc: { en: "How I went from A to B", tr: "A'dan B'ye nasıl gittim" } },
  "quick-win": { emoji: "⚡", label: { en: "Quick Win", tr: "Hızlı Kazanım" }, desc: { en: "One tactic that changed everything", tr: "Her şeyi değiştiren bir taktik" } },
  "case-study": { emoji: "🔥", label: { en: "Case Study", tr: "Vaka Analizi" }, desc: { en: "How we achieved X in Y days", tr: "X'i Y günde nasıl başardık" } },
  "listicle": { emoji: "📝", label: { en: "Listicle", tr: "Liste" }, desc: { en: "7 ways to do X better", tr: "X'i daha iyi yapmanın 7 yolu" } },
  "tutorial": { emoji: "🛠️", label: { en: "Tutorial", tr: "Rehber" }, desc: { en: "Step-by-step guide to X", tr: "X için adım adım rehber" } },
  "behind-scenes": { emoji: "🎬", label: { en: "Behind the Scenes", tr: "Perde Arkası" }, desc: { en: "What really happens when...", tr: "Gerçekte ne oluyor..." } },
  "hot-take": { emoji: "🔥", label: { en: "Hot Take", tr: "Cesur Görüş" }, desc: { en: "Unpopular opinion about X", tr: "X hakkında popüler olmayan görüş" } },
  "myth-busting": { emoji: "🚫", label: { en: "Myth Busting", tr: "Mit Kırma" }, desc: { en: "X is a lie, here's the truth", tr: "X bir yalan, işte gerçek" } },
  "comparison": { emoji: "⚖️", label: { en: "Comparison", tr: "Karşılaştırma" }, desc: { en: "X vs Y - which is better?", tr: "X vs Y - hangisi daha iyi?" } }
};

const tones = {
  casual: { emoji: "😄", label: { en: "Casual/Funny", tr: "Rahat/Eğlenceli" } },
  inspiring: { emoji: "💪", label: { en: "Inspiring", tr: "Motivasyonel" } },
  educational: { emoji: "🎓", label: { en: "Educational", tr: "Eğitici" } },
  professional: { emoji: "🔬", label: { en: "Professional", tr: "Profesyonel" } },
  controversial: { emoji: "💥", label: { en: "Controversial", tr: "Tartışmalı" } },
  humorous: { emoji: "🤣", label: { en: "Humorous", tr: "Komik" } },
  storytelling: { emoji: "📚", label: { en: "Storytelling", tr: "Hikaye Anlatımı" } },
  urgent: { emoji: "⏰", label: { en: "Urgent/FOMO", tr: "Acil/Kaçırma" } },
  empathetic: { emoji: "❤️", label: { en: "Empathetic", tr: "Empatik" } }
};

const getPlaceholder = (threadType: ThreadType, language: Language): string => {
  const placeholders = {
    vulnerability: {
      en: "Ex: I spent $12K on ads, got 0 customers, then I tried...",
      tr: "Örn: Reklama $12K harcadım, 0 müşteri aldım, sonra denedim ki..."
    },
    "data-driven": {
      en: "Ex: Tested 47 growth tactics, 43 failed, here's what worked...",
      tr: "Örn: 47 büyüme taktiği test ettim, 43'ü başarısız oldu, işe yarayanlar..."
    },
    contrarian: {
      en: "Ex: Everyone says cold email is dead, but I sent 10K emails and...",
      tr: "Örn: Herkes cold email öldü diyor ama 10K email attım ve..."
    },
    journey: {
      en: "Ex: Quit my $140K job to build a startup, 9 months later...",
      tr: "Örn: $140K maaşlı işimi bırakıp startup kurdum, 9 ay sonra..."
    },
    "quick-win": {
      en: "Ex: Changed our landing page headline, conversion went from 2% to 9%...",
      tr: "Örn: Landing page başlığını değiştirdim, conversion %2'den %9'a çıktı..."
    },
    "case-study": {
      en: "Ex: How we got 1000 users in 60 days with $0 ad spend...",
      tr: "Örn: 60 günde $0 reklam bütçesi ile 1000 kullanıcıya nasıl ulaştık..."
    },
    "listicle": {
      en: "Ex: 7 growth hacks that got us from 0 to 10K users...",
      tr: "Örn: Bizi 0'dan 10K kullanıcıya taşıyan 7 büyüme taktiği..."
    },
    "tutorial": {
      en: "Ex: How to build a landing page that converts at 15%...",
      tr: "Örn: %15 dönüşüm yapan landing page nasıl oluşturulur..."
    },
    "behind-scenes": {
      en: "Ex: What happens when your startup goes viral overnight...",
      tr: "Örn: Startup'ınız bir gecede viral olduğunda neler oluyor..."
    },
    "hot-take": {
      en: "Ex: Unpopular opinion: Your MVP should NOT be perfect...",
      tr: "Örn: Popüler olmayan görüş: MVP'niz mükemmel olmamalı..."
    },
    "myth-busting": {
      en: "Ex: The 'work harder' advice is a lie. Here's what actually works...",
      tr: "Örn: 'Daha çok çalış' tavsiyesi bir yalan. İşte gerçekten işe yarayanlar..."
    },
    "comparison": {
      en: "Ex: I tried both Facebook Ads and Google Ads with $5K each...",
      tr: "Örn: Her birine $5K harcayarak Facebook Ads ve Google Ads'i denedim..."
    }
  };
  return placeholders[threadType][language];
};

export const ThreadInput = ({
  onGenerate,
  isLoading,
  mode,
  isHighQuality,
  onHighQualityChange = () => {}
}: ThreadInputProps) => {
  const [topic, setTopic] = useState("");
  const [threadType, setThreadType] = useState<ThreadType>("vulnerability");
  const [tone, setTone] = useState<Tone | "">("");
  const [selectedMode, setSelectedMode] = useState<ThreadMode>("thread");
  const [language, setLanguage] = useState<Language>("en");
  const [isHighQualityChecked, setIsHighQualityChecked] = useState(isHighQuality || false);
  const i18n = useI18n();
  const { language: currentLanguage } = useLanguage();

  // Update language based on context
  useEffect(() => {
    setLanguage(currentLanguage as Language);
  }, [currentLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      // Pass the new parameters to the onGenerate function
      // Note: The API expects specific parameter names, so we map them accordingly
      // Pass the language parameter to ensure correct language generation
      onGenerate(topic, true, true, isHighQualityChecked, language);
    }
  };

  const currentLang = language;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6 rounded-lg border border-white/5">
      {/* Topic Input */}
      <div>
        <Label htmlFor="topic" className="text-sm font-medium">
          {currentLang === "tr" ? "Ne paylaşmak istiyorsun? *" : "What's your story? *"}
        </Label>
        <Textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={getPlaceholder(threadType, currentLang)}
          className="w-full mt-2 min-h-[120px] resize-none"
          required
        />
      </div>

      {/* Thread Type and Tone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">
            {currentLang === "tr" ? "Thread Tipi" : "Thread Type"}
          </Label>
          <Select value={threadType} onValueChange={(value) => setThreadType(value as ThreadType)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(threadTypes).map(([key, type]) => (
                <SelectItem key={key} value={key}>
                  {type.emoji} {type.label[currentLang]} - {type.desc[currentLang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">
            {currentLang === "tr" ? "Ton (opsiyonel)" : "Tone (optional)"}
          </Label>
          <Select value={tone} onValueChange={(value) => setTone(value as Tone | "")}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={currentLang === "tr" ? "Seçiniz (varsayılan)" : "Select (default)"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {currentLang === "tr" ? "Varsayılan" : "Default"}
              </SelectItem>
              {Object.entries(tones).map(([key, toneData]) => (
                <SelectItem key={key} value={key}>
                  {toneData.emoji} {toneData.label[currentLang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mode and Language Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">
            {currentLang === "tr" ? "Mod" : "Mode"}
          </Label>
          <Select value={selectedMode} onValueChange={(value) => setSelectedMode(value as ThreadMode)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thread">
                {currentLang === "tr" ? "Tam Thread" : "Full Thread"}
              </SelectItem>
              <SelectItem value="tweet">
                {currentLang === "tr" ? "Tek Gönderi" : "Single Post"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">
            {currentLang === "tr" ? "Dil" : "Language"}
          </Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* High Quality Score Optimization */}
      <div className="flex items-center justify-center">
        <div
          className={`px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            isHighQualityChecked
              ? 'bg-purple-900/30 border-purple-500 text-purple-300'
              : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-purple-400'
          }`}
          onClick={() => {
            const newValue = !isHighQualityChecked;
            setIsHighQualityChecked(newValue);
            onHighQualityChange(newValue);
          }}
        >
          <span className="text-sm font-medium">
            {isHighQualityChecked
              ? (currentLang === "tr" ? "Yüksek Kalite Skoru Optimizasyonu ✓" : "High Quality Score Optimization ✓")
              : (currentLang === "tr" ? "Yüksek Kalite Skoru Optimizasyonu" : "High Quality Score Optimization")
            }
          </span>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3"
      >
        {isLoading
          ? (currentLang === "tr" ? "Oluşturuluyor..." : "Forging...")
          : (currentLang === "tr" ? "Thread Oluştur" : "Forge Thread")
        }
      </Button>
    </form>
  );
};
