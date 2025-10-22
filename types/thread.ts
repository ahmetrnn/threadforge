export type ThreadTweet = {
  tweetNumber: number;
  text: string;
  emojis: string[];
  isCta: boolean;
};

export type ThreadResponse = {
  thread: ThreadTweet[];
  estimatedImpressions: string;
  publishTips?: string;
};
