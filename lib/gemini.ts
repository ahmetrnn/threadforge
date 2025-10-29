import { GoogleGenAI } from "@google/genai";
import type { Tool } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

/**
 * Get or create singleton Gemini client instance
 */
export const getGeminiClient = () => {
  if (geminiClient) return geminiClient;

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GEMINI_API_KEY environment variable.");
  }

  geminiClient = new GoogleGenAI({ apiKey });
  return geminiClient;
};

/**
 * Available Gemini models
 */
export const GEMINI_MODELS = {
  GEMINI_1_5_PRO: "gemini-1.5-pro",
  GEMINI_1_5_FLASH: "gemini-1.5-flash",
  GEMINI_2_0_FLASH: "gemini-2.0-flash-exp",
  GEMINI_2_5_PRO: "gemini-2.5-pro",
} as const;

/**
 * Google Search grounding tool configuration
 * Enables real-time web search for factual accuracy and citations
 */
export const getGroundingTool = (): Tool => {
  return {
    googleSearch: {},
  };
};

/**
 * Determine if a thread request should use grounding based on content type
 * This helps control costs by only using grounding when needed
 */
export const shouldUseGrounding = (
  topic: string,
  threadType?: string
): boolean => {
  // Always ground for product/company information
  const productKeywords = [
    "product",
    "company",
    "startup",
    "tool",
    "service",
    "platform",
    "app",
    "software",
    "saas",
  ];

  // Always ground for data/statistics/current events
  const dataKeywords = [
    "data",
    "statistics",
    "stats",
    "research",
    "study",
    "analysis",
    "market",
    "trend",
    "2024",
    "2025",
    "recent",
    "latest",
    "current",
  ];

  // Skip grounding for personal stories and generic tutorials
  const skipKeywords = ["my journey", "my story", "i built", "i made", "how to"];

  const lowerTopic = topic.toLowerCase();

  // Check if we should skip grounding
  if (skipKeywords.some((keyword) => lowerTopic.includes(keyword))) {
    // But still ground if it's about specific products/data
    if (
      productKeywords.some((keyword) => lowerTopic.includes(keyword)) ||
      dataKeywords.some((keyword) => lowerTopic.includes(keyword))
    ) {
      return true;
    }
    return false;
  }

  // Check if we should ground
  if (
    productKeywords.some((keyword) => lowerTopic.includes(keyword)) ||
    dataKeywords.some((keyword) => lowerTopic.includes(keyword))
  ) {
    return true;
  }

  // Thread type based decisions
  if (threadType === "data-driven" || threadType === "comparison") {
    return true;
  }

  if (threadType === "storytelling" || threadType === "journey") {
    return false;
  }

  // Default: use grounding for safety (better to have citations than hallucinations)
  return true;
};

/**
 * Extract grounding metadata (sources/citations) from Gemini response
 */
export interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
}

export const extractGroundingSources = (
  groundingMetadata: any
): GroundingSource[] => {
  if (!groundingMetadata) return [];

  const sources: GroundingSource[] = [];

  // Gemini returns grounding metadata with search results
  if (groundingMetadata.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          url: chunk.web.uri || "",
          snippet: chunk.web.snippet,
        });
      }
    }
  }

  // Deduplicate by URL
  const uniqueSources = sources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.url === source.url)
  );

  return uniqueSources.slice(0, 5); // Limit to top 5 sources
};
