import OpenAI from "openai";

let xai: OpenAI | null = null;

export const getXAIClient = () => {
  if (xai) return xai;

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing XAI_API_KEY environment variable.");
  }

  // xAI uses OpenAI-compatible API
  xai = new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1"
  });
  return xai;
};

// Available Grok models from xAI
export const GROK_MODELS = {
  GROK_2_LATEST: "grok-2-latest",
  GROK_2_1212: "grok-2-1212",
  GROK_BETA: "grok-beta",
  GROK_VISION_BETA: "grok-vision-beta",
} as const;
