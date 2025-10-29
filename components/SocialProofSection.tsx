"use client";

import { useI18n } from "@/lib/i18n/context";
import { Quote, Star, TrendingUp, Users, Zap, MessageCircle } from "lucide-react";

export const SocialProofSection = () => {
  const i18n = useI18n();

  const testimonials = [
    {
      nameKey: "landing.social_proof.testimonial1.name",
      roleKey: "landing.social_proof.testimonial1.role",
      contentKey: "landing.social_proof.testimonial1.content",
      avatar: "1",
    },
    {
      nameKey: "landing.social_proof.testimonial2.name",
      roleKey: "landing.social_proof.testimonial2.role",
      contentKey: "landing.social_proof.testimonial2.content",
      avatar: "2",
    },
    {
      nameKey: "landing.social_proof.testimonial3.name",
      roleKey: "landing.social_proof.testimonial3.role",
      contentKey: "landing.social_proof.testimonial3.content",
      avatar: "3",
    },
  ];

  const stats = [
    {
      icon: Users,
      valueKey: "landing.social_proof.stats.users.value",
      labelKey: "landing.social_proof.stats.users.label",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: MessageCircle,
      valueKey: "landing.social_proof.stats.threads.value",
      labelKey: "landing.social_proof.stats.threads.label",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      valueKey: "landing.social_proof.stats.engagement.value",
      labelKey: "landing.social_proof.stats.engagement.label",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      valueKey: "landing.social_proof.stats.satisfaction.value",
      labelKey: "landing.social_proof.stats.satisfaction.label",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {i18n.t("landing.social_proof.stats_title")}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl text-center hover:bg-white/[0.05] transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 mb-4 mx-auto`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {i18n.t(stat.valueKey)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {i18n.t(stat.labelKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {i18n.t("landing.social_proof.testimonials_title")}
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              {i18n.t("landing.social_proof.testimonials_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl hover:bg-white/[0.05] transition-all duration-300 hover:scale-105 relative"
              >
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-purple-500/30 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{i18n.t(testimonial.contentKey)}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {i18n.t(testimonial.nameKey)}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {i18n.t(testimonial.roleKey)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
