export type ThreadTweet = {
  tweetNumber: number;
  text: string;
  emojis: string[];
  isCta: boolean;
};

export type ThreadMode = "thread" | "single";

export type ThreadResponse = {
  thread: ThreadTweet[];
  estimatedImpressions: string;
  publishTips?: string;
  mode?: ThreadMode;
};
