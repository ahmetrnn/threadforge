"use client";

import { useI18n } from "@/lib/i18n/context";
import { Twitter, Github, Mail, Heart } from "lucide-react";

export const Footer = () => {
  const i18n = useI18n();

  const footerLinks = {
    product: [
      { labelKey: "landing.footer.product.features", href: "#features" },
      { labelKey: "landing.footer.product.pricing", href: "#pricing" },
      { labelKey: "landing.footer.product.how_it_works", href: "#how-it-works" },
    ],
    company: [
      { labelKey: "landing.footer.company.about", href: "#about" },
      { labelKey: "landing.footer.company.blog", href: "#blog" },
      { labelKey: "landing.footer.company.contact", href: "#contact" },
    ],
    legal: [
      { labelKey: "landing.footer.legal.privacy", href: "#privacy" },
      { labelKey: "landing.footer.legal.terms", href: "#terms" },
      { labelKey: "landing.footer.legal.cookies", href: "#cookies" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/threadforge", label: "Twitter" },
    { icon: Github, href: "https://github.com/threadforge", label: "GitHub" },
    { icon: Mail, href: "mailto:hello@threadforge.com", label: "Email" },
  ];

  return (
    <footer className="relative border-t border-white/10 mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ThreadForge
              </span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              {i18n.t("landing.footer.brand_description")}
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:bg-white/[0.05] transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {i18n.t("landing.footer.product.title")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {i18n.t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {i18n.t("landing.footer.company.title")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {i18n.t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {i18n.t("landing.footer.legal.title")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {i18n.t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {i18n.t("landing.footer.copyright", {
                year: new Date().getFullYear(),
              })}
            </p>

            <p className="text-gray-400 text-sm flex items-center gap-2">
              {i18n.t("landing.footer.made_with")}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              {i18n.t("landing.footer.by_creators")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
