"use client";

import { useI18n } from "@/lib/i18n/context";
import { PenLine, Sparkles, Share2, ArrowRight } from "lucide-react";

export const HowItWorksSection = () => {
  const i18n = useI18n();

  const steps = [
    {
      icon: PenLine,
      titleKey: "landing.how_it_works.step1.title",
      descriptionKey: "landing.how_it_works.step1.description",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Sparkles,
      titleKey: "landing.how_it_works.step2.title",
      descriptionKey: "landing.how_it_works.step2.description",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Share2,
      titleKey: "landing.how_it_works.step3.title",
      descriptionKey: "landing.how_it_works.step3.description",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {i18n.t("landing.how_it_works.section_title")}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {i18n.t("landing.how_it_works.section_subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-green-500/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step card */}
                  <div className="glass-card p-8 rounded-2xl text-center hover:bg-white/[0.05] transition-all duration-300 hover:scale-105 relative z-10">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} p-4 mb-6 mx-auto hover:rotate-12 transition-transform duration-300`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {i18n.t(step.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">
                      {i18n.t(step.descriptionKey)}
                    </p>
                  </div>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-2 transform -translate-y-1/2 z-0">
                      <ArrowRight className="w-8 h-8 text-purple-500/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6 text-lg">
            {i18n.t("landing.how_it_works.cta_text")}
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
          >
            {i18n.t("landing.how_it_works.cta_button")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
