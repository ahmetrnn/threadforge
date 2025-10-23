"use client";

import { useState } from "react";
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

  const isConnected = !!xUsername;

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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
      <h3 className="text-lg font-semibold text-neutral-100">X Account</h3>

      {isConnected ? (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
              <svg
                className="h-5 w-5 text-neutral-100"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-100">@{xUsername}</p>
              {xConnectedAt && (
                <p className="text-xs text-neutral-400">
                  Connected {new Date(xConnectedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect X Account"}
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-neutral-400">
            Connect your X account to post threads directly from ThreadForge.
          </p>
          <Button
            className="w-full"
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
