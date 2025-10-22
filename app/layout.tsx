import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThreadForge — Viral X Threads in Seconds",
  description:
    "ThreadForge helps indie makers craft viral X (Twitter) threads with AI-powered hooks, vibes, and CTAs in under a minute.",
  openGraph: {
    title: "ThreadForge",
    description:
      "Generate maker-friendly X threads with hooks, emojis, and CTAs. Free tier + $9/mo Pro.",
    url: "https://threadforge.app",
    siteName: "ThreadForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThreadForge",
    description:
      "Generate viral X threads with maker vibes in seconds. Freemium with Pro upgrade.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#050505] text-neutral-100`}> 
        <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
          {children}
        </div>
        <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff" } }} />
      </body>
    </html>
  );
}
