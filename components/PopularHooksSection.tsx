"use client";

import { useI18n } from "@/lib/i18n/context";
import {
  Heart,
  Zap,
  TrendingUp,
  Target,
  BookOpen,
  ListChecks,
  HelpCircle,
  Eye,
  Clock,
  Trophy,
} from "lucide-react";
import { useState } from "react";

export const PopularHooksSection = () => {
  const i18n = useI18n();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hooks = [
    {
      icon: Heart,
      titleKey: "landing.popular_hooks.vulnerability.title",
      descriptionKey: "landing.popular_hooks.vulnerability.description",
      exampleKey: "landing.popular_hooks.vulnerability.example",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Zap,
      titleKey: "landing.popular_hooks.contrarian.title",
      descriptionKey: "landing.popular_hooks.contrarian.description",
      exampleKey: "landing.popular_hooks.contrarian.example",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      titleKey: "landing.popular_hooks.data_proof.title",
      descriptionKey: "landing.popular_hooks.data_proof.description",
      exampleKey: "landing.popular_hooks.data_proof.example",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Target,
      titleKey: "landing.popular_hooks.case_study.title",
      descriptionKey: "landing.popular_hooks.case_study.description",
      exampleKey: "landing.popular_hooks.case_study.example",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: BookOpen,
      titleKey: "landing.popular_hooks.storytelling.title",
      descriptionKey: "landing.popular_hooks.storytelling.description",
      exampleKey: "landing.popular_hooks.storytelling.example",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: ListChecks,
      titleKey: "landing.popular_hooks.listicle.title",
      descriptionKey: "landing.popular_hooks.listicle.description",
      exampleKey: "landing.popular_hooks.listicle.example",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: HelpCircle,
      titleKey: "landing.popular_hooks.question.title",
      descriptionKey: "landing.popular_hooks.question.description",
      exampleKey: "landing.popular_hooks.question.example",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Eye,
      titleKey: "landing.popular_hooks.curiosity_gap.title",
      descriptionKey: "landing.popular_hooks.curiosity_gap.description",
      exampleKey: "landing.popular_hooks.curiosity_gap.example",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: Clock,
      titleKey: "landing.popular_hooks.urgency.title",
      descriptionKey: "landing.popular_hooks.urgency.description",
      exampleKey: "landing.popular_hooks.urgency.example",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Trophy,
      titleKey: "landing.popular_hooks.achievement.title",
      descriptionKey: "landing.popular_hooks.achievement.description",
      exampleKey: "landing.popular_hooks.achievement.example",
      gradient: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold">
              {i18n.t("landing.popular_hooks.badge")}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {i18n.t("landing.popular_hooks.section_title")}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {i18n.t("landing.popular_hooks.section_subtitle")}
          </p>
        </div>

        {/* Hooks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hooks.map((hook, index) => {
            const Icon = hook.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group glass-card p-6 rounded-2xl hover:bg-white/[0.05] transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${hook.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${hook.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {i18n.t(hook.titleKey)}
                  </h3>

                  {/* Description or Example */}
                  <p
                    className={`text-sm leading-relaxed transition-all duration-300 ${
                      isHovered ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {isHovered
                      ? i18n.t(hook.exampleKey)
                      : i18n.t(hook.descriptionKey)}
                  </p>

                  {/* Hover indicator */}
                  {!isHovered && (
                    <div className="mt-3 flex items-center text-xs text-gray-500 group-hover:text-cyan-400 transition-colors">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{i18n.t("landing.popular_hooks.hover_hint")}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            {i18n.t("landing.popular_hooks.cta_text")}
          </p>
          <button
            onClick={() => {
              const dashboardButton = document.querySelector(
                'button[onclick*="dashboard"]'
              );
              if (dashboardButton) {
                (dashboardButton as HTMLButtonElement).click();
              } else {
                window.location.href = "/signup";
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
          >
            {i18n.t("landing.popular_hooks.cta_button")}
          </button>
        </div>
      </div>
    </section>
  );
};
