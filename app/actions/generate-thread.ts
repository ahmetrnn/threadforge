"use server";

import { ThreadResponse } from "@/types/thread";

export async function generateThread(
  topic: string,
  style: string,
  language: string,
  emojis: boolean,
  hashtags: boolean,
  isHighQuality: boolean,
  mode: "basic" | "advanced"
): Promise<ThreadResponse & { error?: string }> {
  try {
    const response = await fetch("http://localhost:3000/api/generate-thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        style,
        language,
        emojis,
        hashtags,
        isHighQuality,
        mode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || "Failed to generate thread.",
        thread: [],
        credits: 0,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating thread:", error);
    return {
      error: "An unexpected error occurred.",
      thread: [],
      credits: 0,
    };
  }
}