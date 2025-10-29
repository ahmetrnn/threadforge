"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = createSupabaseBrowserClient();

type XAccountConnectionProps = {
  xUsername?: string | null;
  xConnectedAt?: string | null;
};

export function XAccountConnection({ xUsername, xConnectedAt }: XAccountConnectionProps) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");

  const isConnected = !!xUsername;

  useEffect(() => {
    // Format date on client side only to avoid hydration mismatch
    if (xConnectedAt) {
      setFormattedDate(new Date(xConnectedAt).toLocaleDateString());
    }
  }, [xConnectedAt]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const redirectTo = `${window.location.origin}/dashboard?x_connect=true`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        toast.error("Failed to connect X account.");
        console.error(error);
        setIsConnecting(false);
      }
      // Don't set isConnecting to false here as we're redirecting
    } catch (error) {
      console.error("X connection error:", error);
      toast.error("Failed to initiate X connection.");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      const response = await fetch("/api/twitter/disconnect", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to disconnect." }));
        toast.error(error.message ?? "Failed to disconnect X account.");
        return;
      }

      toast.success("X account disconnected.");
      router.refresh();
    } catch (error) {
      console.error("X disconnection error:", error);
      toast.error("Failed to disconnect X account.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <h3 className="text-lg font-semibold text-white">X Account</h3>

      {isConnected ? (
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-cyan-400"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-white">@{xUsername}</p>
              {formattedDate && (
                <p className="text-sm font-light text-white/50">
                  Connected {formattedDate}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-white/20 bg-white/5 text-white hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect X Account"}
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm font-light leading-relaxed text-white/70">
            Connect your X account to post threads directly from ThreadForge.
          </p>
          <Button
            className="w-full bg-cyan-500 text-black font-semibold shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect X Account"}
          </Button>
        </div>
      )}
    </div>
  );
}
