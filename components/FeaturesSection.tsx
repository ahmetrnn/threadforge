"use client";

import { useI18n } from "@/lib/i18n/context";
import { Brain, Globe, Sparkles, Zap, Target, Shield } from "lucide-react";

export const FeaturesSection = () => {
  const i18n = useI18n();

  const features = [
    {
      icon: Brain,
      titleKey: "landing.features.ai_powered.title",
      descriptionKey: "landing.features.ai_powered.description",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Zap,
      titleKey: "landing.features.instant_generation.title",
      descriptionKey: "landing.features.instant_generation.description",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      titleKey: "landing.features.multilingual.title",
      descriptionKey: "landing.features.multilingual.description",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      titleKey: "landing.features.quality_control.title",
      descriptionKey: "landing.features.quality_control.description",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Sparkles,
      titleKey: "landing.features.customization.title",
      descriptionKey: "landing.features.customization.description",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      titleKey: "landing.features.quality_guaranteed.title",
      descriptionKey: "landing.features.quality_guaranteed.description",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {i18n.t("landing.features.section_title")}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {i18n.t("landing.features.section_subtitle")}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group glass-card p-8 rounded-2xl hover:bg-white/[0.05] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {i18n.t(feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {i18n.t(feature.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
