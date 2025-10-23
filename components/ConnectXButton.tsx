'use client';

import { useState } from 'react';

type ConnectXButtonProps = {
  className?: string;
  isConnected?: boolean;
};

export function ConnectXButton({ className, isConnected = false }: ConnectXButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID;
      if (!clientId) {
        console.error('Missing NEXT_PUBLIC_X_CLIENT_ID env variable.');
        setIsLoading(false);
        return;
      }

      const redirectUri =
        process.env.NEXT_PUBLIC_X_REDIRECT_URI ?? 'http://localhost:3000/api/auth/callback';

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = crypto.randomUUID();

      setCookie('x_oauth_state', state, 600);
      setCookie('x_oauth_code_verifier', codeVerifier, 600);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'tweet.write offline.access',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      window.location.href = `https://x.com/i/oauth2/authorize?${params.toString()}`;
    } catch (error) {
      console.error('Unable to kick off X OAuth flow', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800 ${className ?? ''}`}
    >
      {isLoading ? 'Connecting…' : isConnected ? 'Reconnect X' : 'Connect X for Auto-Post'}
    </button>
  );
}

function generateCodeVerifier(length = 64) {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  return base64UrlEncode(randomBytes);
}

async function generateCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(buffer: Uint8Array) {
  let binary = "";
  for (let i = 0; i < buffer.length; i += 1) {
    binary += String.fromCharCode(buffer[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isHttps ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
}
