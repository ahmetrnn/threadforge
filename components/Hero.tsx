"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { Sparkles, Zap, TrendingUp } from "lucide-react";

export const Hero = () => {
  const router = useRouter();
  const i18n = useI18n();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/20 to-blue-900/20 animate-gradient" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 glass-card-hover transition-all duration-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-gray-300">
            {i18n.t("landing.hero.badge")}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            {i18n.t("landing.hero.title")}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
          {i18n.t("landing.hero.subtitle")}
        </p>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          {i18n.t("landing.hero.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={() => router.push("/dashboard")}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {i18n.t("landing.hero.cta_primary")}
          </button>

          <button
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 glass-card rounded-lg font-semibold text-white border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.05]"
          >
            {i18n.t("landing.hero.cta_secondary")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <div className="text-3xl font-bold text-white">10K+</div>
            </div>
            <div className="text-gray-400 text-sm">
              {i18n.t("landing.hero.stat_threads")}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div className="text-3xl font-bold text-white">99%</div>
            </div>
            <div className="text-gray-400 text-sm">
              {i18n.t("landing.hero.stat_satisfaction")}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div className="text-3xl font-bold text-white">&lt;30s</div>
            </div>
            <div className="text-gray-400 text-sm">
              {i18n.t("landing.hero.stat_generation_time")}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};
