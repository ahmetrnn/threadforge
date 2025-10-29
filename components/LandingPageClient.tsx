"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PopularHooksSection } from "@/components/PopularHooksSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { Footer } from "@/components/Footer";

interface LandingPageClientProps {
  user: User | null;
  initialCredits: number;
}

export const LandingPageClient = ({
  user,
}: LandingPageClientProps) => {
  const router = useRouter();
  const i18n = useI18n();

  // Always show the marketing landing page on the home page
  return (
    <div className="min-h-screen">
      {/* Header with language switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ThreadForge
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {user ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  {i18n.t("landing.header.dashboard")}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {i18n.t("landing.header.login")}
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    {i18n.t("landing.header.signup")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <div className="pt-20">
        <Hero />
        <div id="features">
          <FeaturesSection />
        </div>
        <PopularHooksSection />
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <SocialProofSection />
        <Footer />
      </div>
    </div>
  );
};
