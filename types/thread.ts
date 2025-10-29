export type Language = "en" | "tr";

export interface ThreadTweet {
  id: number;
  text: string;
  tweetNumber?: number;
  emojis?: string[];
  isCta?: boolean;
}

export interface ThreadData {
  [key: string]: ThreadTweet[];
}

export type ThreadMode = "thread" | "tweet" | "single";

export interface GroundingSource {
  url: string;
  title: string;
  text: string;
  snippet?: string;
}

export interface ThreadResponse {
  thread: ThreadTweet[];
  credits: number;
  estimatedImpressions?: number;
  publishTips?: string[];
  qualityScore?: number;
  sources?: GroundingSource[];
  isGrounded?: boolean;
  mode?: ThreadMode;
}
