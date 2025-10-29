/**
 * Quality validation for generated threads
 * Ensures threads meet viral standards
 */

import type { ThreadTweet } from "@/types/thread";

export interface QualityIssue {
  severity: "error" | "warning";
  message: string;
  tweetNumber?: number;
}

export interface QualityReport {
  isValid: boolean;
  score: number; // 0-100
  issues: QualityIssue[];
  suggestions: string[];
}

/**
 * Validate thread quality against viral standards
 */
export function validateThreadQuality(
  thread: ThreadTweet[],
  mode: "thread" | "single"
): QualityReport {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;

  if (thread.length === 0) {
    return {
      isValid: false,
      score: 0,
      issues: [{ severity: "error", message: "Thread is empty" }],
      suggestions: [],
    };
  }

  const firstTweet = thread[0];
  const lastTweet = thread[thread.length - 1];

  // CRITICAL: Hook Quality (30 points)
  const hookScore = validateHook(firstTweet.text);
  score -= Math.max(0, 30 - hookScore);

  if (hookScore < 15) {
    issues.push({
      severity: "error",
      message: "Hook is weak. Missing bold statement, tension, or credibility.",
      tweetNumber: 1,
    });
    suggestions.push("Rewrite first tweet with: shocking stat/claim + struggle + specific metrics");
  } else if (hookScore < 25) {
    issues.push({
      severity: "warning",
      message: "Hook could be stronger. Add more specific numbers or surprising elements.",
      tweetNumber: 1,
    });
  }

  // Specificity Check (20 points)
  const hasNumbers = checkForNumbers(thread);
  if (!hasNumbers.hasAny) {
    score -= 20;
    issues.push({
      severity: "error",
      message: "No specific metrics or numbers found. Add concrete data.",
    });
    suggestions.push("Include: revenue numbers, user counts, percentages, time periods");
  } else if (hasNumbers.count < 3) {
    score -= 10;
    issues.push({
      severity: "warning",
      message: `Only ${hasNumbers.count} numbers found. Aim for 3+ specific metrics.`,
    });
  }

  // Vulnerability Check (15 points)
  const hasVulnerability = checkForVulnerability(thread);
  if (!hasVulnerability) {
    score -= 15;
    issues.push({
      severity: "warning",
      message: "Thread lacks vulnerability. Share failures, doubts, or struggles.",
    });
    suggestions.push("Add: '$0 revenue', 'almost quit', 'spent X hours failing'");
  }

  // Tweet Length Check (10 points)
  thread.forEach((tweet, idx) => {
    const length = tweet.text.length;
    if (length > 280) {
      score -= 5;
      issues.push({
        severity: "error",
        message: `Tweet ${idx + 1} exceeds 280 characters (${length} chars)`,
        tweetNumber: idx + 1,
      });
    } else if (length < 100 && mode === "thread") {
      score -= 2;
      issues.push({
        severity: "warning",
        message: `Tweet ${idx + 1} is very short (${length} chars). Add more context.`,
        tweetNumber: idx + 1,
      });
    }
  });

  // CTA Quality (15 points)
  const ctaScore = validateCTA(lastTweet);
  score -= Math.max(0, 15 - ctaScore);

  if (ctaScore < 8) {
    issues.push({
      severity: "error",
      message: "CTA is weak or missing. Offer specific value.",
      tweetNumber: thread.length,
    });
    suggestions.push("CTA should offer: feedback, resource, template, or conversation");
  }

  // Generic Language Check (10 points)
  const genericTerms = checkForGenericLanguage(thread);
  if (genericTerms.length > 0) {
    score -= Math.min(10, genericTerms.length * 2);
    issues.push({
      severity: "warning",
      message: `Generic terms found: ${genericTerms.slice(0, 3).join(", ")}`,
    });
    suggestions.push("Replace generic terms with specific examples and numbers");
  }

  // Label Detection (CRITICAL)
  const hasLabels = checkForLabels(thread);
  if (hasLabels.found) {
    score -= 20;
    issues.push({
      severity: "error",
      message: `Found labels/formatting: ${hasLabels.labels.join(", ")}. Remove them.`,
    });
    suggestions.push("Rewrite in pure narrative flow without 'Tip:', 'Lesson:', etc.");
  }

  // Stricter validation for high quality - require higher scores
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const isValid = score >= 60 && errorCount <= 1; // Allow 60+ score with at most 1 error for now

  return {
    isValid,
    score: Math.max(0, score),
    issues,
    suggestions,
  };
}

/**
 * Validate hook quality (0-30 points)
 */
function validateHook(hookText: string): number {
  let score = 0;

  // Check for numbers/metrics (credibility) - 10 points
  if (/\$[\d,]+|\d+%|\d+[KMB]|\d+x/i.test(hookText)) {
    score += 10;
  } else if (/\d+/.test(hookText)) {
    score += 5;
  }

  // Check for tension words - 10 points
  const tensionWords = [
    "failed",
    "quit",
    "lost",
    "struggling",
    "mistake",
    "wrong",
    "disaster",
    "crashed",
    "burned",
    "wasted",
  ];
  if (tensionWords.some((word) => hookText.toLowerCase().includes(word))) {
    score += 10;
  }

  // Check for transformation/surprise - 10 points
  const transformWords = ["then", "but", "until", "here's what", "turned out"];
  if (transformWords.some((word) => hookText.toLowerCase().includes(word))) {
    score += 10;
  } else if (hookText.includes("?") || hookText.includes("!")) {
    score += 5; // Partial credit for question/exclamation
  }

  return score;
}

/**
 * Check for specific numbers and metrics
 */
function checkForNumbers(thread: ThreadTweet[]): { hasAny: boolean; count: number } {
  let count = 0;
  const fullText = thread.map((t) => t.text).join(" ");

  // Match various number formats
  const numberPatterns = [
    /\$[\d,]+/, // Dollar amounts
    /\d+%/, // Percentages
    /\d+[KMB]/, // K/M/B notation
    /\d+x/, // Multipliers
    /\d{1,3}(,\d{3})+/, // Comma-separated numbers
    /\d+ (users|customers|signups|replies|months|days|hours|minutes)/, // Counts with units
  ];

  numberPatterns.forEach((pattern) => {
    const matches = fullText.match(new RegExp(pattern, "g"));
    if (matches) count += matches.length;
  });

  return { hasAny: count > 0, count };
}

/**
 * Check for vulnerability indicators
 */
function checkForVulnerability(thread: ThreadTweet[]): boolean {
  const fullText = thread.map((t) => t.text).join(" ").toLowerCase();

  const vulnerabilityIndicators = [
    "$0",
    "failed",
    "quit",
    "almost",
    "struggling",
    "mistake",
    "wrong",
    "didn't know",
    "didn't work",
    "wasted",
    "burned through",
    "lost",
    "crying",
    "afraid",
    "doubted",
    "questioning",
  ];

  return vulnerabilityIndicators.some((indicator) => fullText.includes(indicator));
}

/**
 * Validate CTA quality (0-15 points)
 */
function validateCTA(lastTweet: ThreadTweet): number {
  let score = 0;
  const text = lastTweet.text.toLowerCase();

  // Has clear ask - 5 points
  const askWords = ["reply", "dm", "comment", "share", "bookmark"];
  if (askWords.some((word) => text.includes(word))) {
    score += 5;
  }

  // Offers value - 5 points
  const valueWords = [
    "feedback",
    "template",
    "playbook",
    "breakdown",
    "help",
    "share",
    "send",
    "guide",
  ];
  if (valueWords.some((word) => text.includes(word))) {
    score += 5;
  }

  // Specific/actionable - 5 points
  if (text.includes("reply") && (text.includes("'") || text.includes('"'))) {
    score += 5; // Has keyword to reply with
  } else if (text.includes("if you") || text.includes("working on")) {
    score += 3; // Targeted to specific audience
  }

  return score;
}

/**
 * Check for generic/overused language
 */
function checkForGenericLanguage(thread: ThreadTweet[]): string[] {
  const fullText = thread.map((t) => t.text).join(" ").toLowerCase();
  const genericTerms = [
    "game changer",
    "game-changing",
    "amazing",
    "incredible",
    "awesome",
    "fantastic",
    "revolutionary",
    "powerful strategy",
    "secret sauce",
    "growth hacks",
    "tips and tricks",
  ];

  return genericTerms.filter((term) => fullText.includes(term));
}

/**
 * Check for labels and formatting crutches
 */
function checkForLabels(thread: ThreadTweet[]): { found: boolean; labels: string[] } {
  const labels: string[] = [];
  const labelPatterns = [
    /\bLesson:?/i,
    /\bTip #?\d+:?/i,
    /\bHack:?/i,
    /\bKey (takeaway|insight):?/i,
    /\bStep \d+:?/i,
    /\bPro tip:?/i,
    /\bBonus:?/i,
    /\bTakeaway:?/i,
    /\bBottom line:?/i,
    /^\d+\./m, // Numbered lists at start of tweet
  ];

  thread.forEach((tweet) => {
    labelPatterns.forEach((pattern) => {
      const match = tweet.text.match(pattern);
      if (match && !labels.includes(match[0])) {
        labels.push(match[0]);
      }
    });
  });

  return { found: labels.length > 0, labels };
}

/**
 * Get improvement suggestions based on quality report
 */
export function getImprovementSuggestions(report: QualityReport): string {
  if (report.score >= 85) {
    return "Thread quality is excellent! Minor tweaks if any.";
  } else if (report.score >= 70) {
    return `Good thread (${report.score}/100). Suggestions: ${report.suggestions.join(" | ")}`;
  } else if (report.score >= 60) {
    return `Acceptable thread (${report.score}/100). Needs improvement: ${report.suggestions.join(" | ")}`;
  } else {
    return `Thread quality too low (${report.score}/100). Major issues: ${report.issues
      .filter((i) => i.severity === "error")
      .map((i) => i.message)
      .join(" | ")} - Will regenerate automatically.`;
  }
}
