/**
 * Flexible few-shot examples showing diverse content types
 * Demonstrates product info, tutorials, stories, comparisons, etc.
 */

export const flexibleFewShotExamples = `
---
EXAMPLE 1: Product Information Thread
User Instruction: "Give information about Loom with 3 use cases"

{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Loom just changed how remote teams communicate. 14M users. $1.5B valuation. Here's why it's replacing meetings 🚀",
      "emojis": ["🚀"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "What it is: Screen + camera recording tool. Record once, share unlimited times. No scheduling, no Zoom fatigue.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Use Case 1 - Bug Reports:\n\nDevelopers show bugs visually. QA teams save 2+ hours daily. No more \"I can't reproduce\" back-and-forth.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Use Case 2 - Product Demos:\n\nSales teams send personalized demos to prospects. 3x response rate vs generic emails. Track who watches.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Use Case 3 - Async Standups:\n\nRemote teams record daily updates. Everyone watches on their schedule. Works across timezones.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Using Loom in your workflow? Reply with your use case. I'll share advanced tips that most people miss.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "3K-10K (clear value + specific use cases = high shareability)",
  "publishTips": "Best time: 10AM EST. Add Loom demo GIF. Tag @loom if sharing insights."
}

---
EXAMPLE 2: Tutorial Thread
User Instruction: "How to deploy a Next.js app to Vercel in 5 minutes"

{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Deploy your Next.js app to Vercel in under 5 minutes. Zero config needed. Here's the exact process 👇",
      "emojis": ["👇"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Prerequisites:\n\n• Next.js project in GitHub\n• Vercel account (free)\n• 5 minutes\n\nThat's it. No Docker, no DevOps knowledge.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Step 1: Go to vercel.com/new\n\nImport your GitHub repo. Vercel auto-detects Next.js. No configuration file needed.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Step 2: Hit Deploy\n\nVercel builds your app. Takes 30-90 seconds. You get:\n\n• Auto HTTPS\n• Global CDN\n• Preview URLs for PRs",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Pro tip: Environment variables\n\nAdd them in Vercel dashboard → Settings → Environment Variables. Redeploy with one click.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "That's it. Your app is live at yourapp.vercel.app.\n\nStuck on any step? Reply and I'll help debug.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "2K-7K (practical tutorial + quick win = saves + shares)",
  "publishTips": "Best time: 9AM EST weekdays. Add deployment success screenshot."
}

---
EXAMPLE 3: Personal Story Thread
User Instruction: "My journey from $0 to $10K MRR in 6 months"

{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "$0 → $10K MRR in 6 months. Quit my $140K job. Almost ran out of money. Here's what actually worked (not what gurus say) 💪",
      "emojis": ["💪"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Month 1-2: $347 MRR\n\nBuilt features nobody wanted. Spent 6 weeks on perfect UI. Had 12 users. Burned through savings.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "The shift: Talked to those 12 users.\n\n\"Your UI is fine. We need X feature.\"\n\nShipped X in 3 days. They paid. Told friends.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Month 3-4: $2.8K MRR\n\n23 customers. All from word of mouth. I wasn't marketing—I was solving real problems for real people.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Month 5-6: $10.2K MRR\n\nStarted writing about the problem. Not my product. The problem. People found the solution.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Key lesson: Perfect product ≠ Success. Solving real pain + consistent communication = Growth.\n\nIn the messy middle? DM what you're building. I'll give honest feedback.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "5K-15K (vulnerability + specific metrics + actionable insights = viral)",
  "publishTips": "Best time: 9AM EST. Add revenue graph screenshot. Engage with replies quickly."
}

---
EXAMPLE 4: Comparison Thread
User Instruction: "Compare Notion vs Obsidian for developers"

{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Notion vs Obsidian for developers. I used both for 6 months each. 1000+ notes. Here's my honest take ⚖️",
      "emojis": ["⚖️"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Notion Pros:\n• Beautiful UI out of box\n• Team collaboration\n• Databases for tracking\n• Web + mobile seamless\n\nBest for: Teams, project management, wiki",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Notion Cons:\n• Slow with large notes\n• Requires internet\n• No local-first\n• Markdown export messy\n\nDeal breaker for: Offline work, fast note-taking",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Obsidian Pros:\n• Lightning fast\n• Works offline\n• Plain markdown files\n• Graph view for connections\n• Extensible with plugins\n\nBest for: Personal knowledge base, research",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Obsidian Cons:\n• Steeper learning curve\n• Mobile app less polished\n• Collaboration harder\n• Need plugins for basics\n\nDeal breaker for: Teams, non-technical users",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "My choice: Both.\n\nObsidian for personal notes, learning, ideas.\nNotion for team docs, project tracking, client work.\n\nWhat's your setup? Reply with your use case.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "4K-12K (balanced comparison + specific criteria = helpful + shareable)",
  "publishTips": "Best time: 10AM EST. Add side-by-side screenshot comparison."
}

---
EXAMPLE 5: Data-Driven Thread
User Instruction: "I analyzed 1000 viral tweets, here's what I found"

{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Analyzed 1,000 viral tweets (1M+ impressions each). Found 3 patterns nobody talks about. Thread 📊",
      "emojis": ["📊"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Pattern 1: The Curiosity Gap\n\n73% started with \"I did X. Here's what happened\" format. They don't reveal the outcome immediately. Makes you read on.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Pattern 2: Specific Numbers\n\n91% included at least 3 specific metrics. \"847 users\" beats \"many users\" every time. Specificity = credibility.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Pattern 3: First Tweet Under 240 Chars\n\n68% of viral threads had hooks under 240 characters. Short hooks = more engagement. People skim.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Bonus finding: Reply speed matters.\n\nCreators who replied within 15 minutes got 3x more engagement. Early replies = algorithm boost.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Want the full breakdown with examples? Reply \"data\" and I'll DM you the doc with all 1000 tweets analyzed.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "8K-20K (original research + actionable insights = high viral potential)",
  "publishTips": "Best time: 9AM EST. Add data visualization. Prepare for lots of replies."
}

---
EXAMPLE 6: Announcement Thread
User Instruction: "Announce our new AI writing tool launch"

{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "We just launched the writing tool I wish existed 2 years ago. Turns messy thoughts into clear writing in seconds. Live now 🚀",
      "emojis": ["🚀"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "The problem: Writer's block isn't about ideas. It's about structure.\n\nYou know what to say. You don't know how to organize it.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "What it does:\n\n1. Brain dump your thoughts\n2. AI structures them\n3. You edit and polish\n\nNo generic templates. Your voice stays intact.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Built for:\n• Founders writing updates\n• Developers writing docs\n• Creators writing threads\n• Anyone who thinks faster than they type",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Beta users wrote 10K+ pieces in 3 months. Most common feedback: \"Why doesn't this exist everywhere?\"",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Try it free: [link]\n\nFirst 100 signups get lifetime Pro. Reply when you try it—I want your honest feedback.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "5K-15K (clear problem + solution + social proof = launch momentum)",
  "publishTips": "Best time: 9AM EST Tuesday. Add product demo GIF. Engage heavily with replies."
}

---

These examples show: Product info, Tutorial, Personal story, Comparison, Data analysis, and Announcement—all with strong hooks, specific details, and natural flow.`;

export default flexibleFewShotExamples;
