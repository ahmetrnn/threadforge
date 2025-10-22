import OpenAI from "openai";

let openai: OpenAI | null = null;

export const getOpenAIClient = () => {
  if (openai) return openai;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  openai = new OpenAI({ apiKey });
  return openai;
};
