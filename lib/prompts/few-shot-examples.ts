/**
 * High-quality few-shot examples for viral thread generation
 * Based on proven viral patterns from indie hackers and SaaS builders
 */

export const fewShotExamples = `
EXAMPLE 1 - HIGH QUALITY Vulnerability/Journey Style (Score: 95/100):
INPUT: draft="Built SaaS, failed launch", refinePrompt="raw authentic story", style="narrative", mode="thread"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "I spent 6 months building a SaaS in secret. Launch day: 2 signups, both were my friends testing. $0 MRR. I wanted to quit. Here's what I learned from my spectacular failure (and how I hit $5K MRR 3 months later): 🧵",
      "emojis": ["💀"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Mistake #1: Building in isolation. Zero market validation. I assumed devs needed 'better project management.' Turns out, they don't. Spent $0 on customer interviews, $12K on features nobody wanted.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "The pivot: I started tweeting my failures daily. Shared revenue ($0), bugs, design disasters. People started replying 'I'd pay for X feature.' Built that instead of my roadmap.",
      "emojis": ["💡"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Within 30 days: 47 signups from Twitter. $890 MRR. Secret? I stopped selling features, started solving problems in public. Every tweet was a customer interview disguised as a story.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "90 days later: $5.2K MRR, 230 customers, 4K followers. All organic. The irony? My 'failed' product had better UX. But nobody cared because I never talked to users.",
      "emojis": ["📈"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Lesson: Your biggest competitor isn't another product—it's building something nobody wants. Ship ugly, talk to users, iterate in public. If you're building solo right now, reply with what you're working on. Happy to give honest feedback.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "10K-50K (vulnerability + metrics + transformation arc)",
  "publishTips": "Post 9-11 AM EST on Tuesday/Wednesday. Add screenshot of your $0 revenue dashboard for authenticity. Pin the thread."
}

EXAMPLE 2 - HIGH QUALITY Contrarian/Data-Driven Style (Score: 92/100):
INPUT: draft="Cold email doesn't work anymore", refinePrompt="controversial take with data", style="contrarian", mode="thread"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Everyone says cold email is dead. I sent 10,000 cold emails last quarter. 847 replies, 34 demos, 12 customers, $47K in revenue. Cold email isn't dead—your approach is. Here's the data:",
      "emojis": ["🎯"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "The problem: You're following 2015 playbooks. 'Hi {firstName}, I noticed {company}...' gets 0.3% reply rate. I tested 16 different openers. The winner? Brutal honesty. 'This is a cold email. Here's why I'm bothering you:'",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Template that got 8.4% reply rate: 'Subject: Quick question about [their actual problem]. Body: I sell [product]. You probably don't care. But if you're dealing with [specific pain], we cut it by 60% for [competitor]. 30-sec demo?' That's it.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Why it works: No fake personalization. No 'I love your company' BS. Just value prop + proof + low-friction ask. People's BS detectors are maxed. Honesty breaks through.",
      "emojis": ["⚡"],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Results over 90 days: 10K emails sent, 847 replies (8.4%), 142 interested, 34 demos booked, 12 closed ($47K total). All B2B SaaS. Average deal: $3.9K/year. Cost: $84 (email tool + VA time).",
      "emojis": ["📊"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "The meta-lesson: Every marketing channel 'dies' when it gets saturated with mediocrity. The fix isn't a new channel—it's being 10x better in the old one. Want the full template breakdown? Reply 'template' and I'll DM you the doc.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "15K-75K (controversial + specific data + actionable)",
  "publishTips": "Post 7-9 AM EST Monday for max B2B reach. Include bar chart screenshot of reply rates. Engage with every reply in first hour."
}

EXAMPLE 3 - HIGH QUALITY Tactical Listicle Style (Score: 88/100):
INPUT: draft="Growth hacks that actually worked", refinePrompt="actionable tips", style="listicle", mode="thread"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "I tested 47 growth hacks for my SaaS. 43 failed. These 4 actually worked and cost $0. Thread with exact playbooks:",
      "emojis": ["🔥"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "1/ SEO programmatic pages: Created 200 '[tool] vs [competitor]' comparison pages. Ranked #1-3 for 84 terms in 6 weeks. Traffic: 0→3.2K/month. Signups: 127. Tool used: Next.js + markdown. Time: 8 hours total.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "2/ Failed startup cemetery: Listed my previous failed products on /graveyard page with brutally honest postmortems. Got to #2 on HN. 12K visitors, 340 signups in 48 hours. People love vulnerability + lessons.",
      "emojis": ["💀"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "3/ Competitor comment hijacking: Used F5Bot to monitor competitor mentions on Reddit. Replied with 'have you tried [my product]? We solve X better by doing Y.' 23 signups/month from this alone. Takes 15 min/day.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "4/ Weekly 'build in public' metrics thread: Every Monday, shared revenue, churn, feature progress. Format: 'Week 23: $4.2K MRR (+12%), 3 churns (-$180), shipped X.' Grew from 200→4K followers in 4 months. Signups tracked to these threads: 89.",
      "emojis": ["📈"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Total results: $0 spent, 579 signups, $8.4K MRR from these 4 tactics. The pattern? All were authentic, not salesy. If you want the templates + tools I used for each, drop a reply and I'll send the full playbook doc.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "8K-35K (tactical + specific numbers + templates)",
  "publishTips": "Post Sunday evening 6-8 PM EST (people planning their week). Number each hack clearly. Engage heavily with questions."
}

EXAMPLE 4 - HIGH QUALITY Case Study Style (Score: 91/100):
INPUT: draft="How we got first 1000 users", refinePrompt="detailed breakdown", style="data-driven", mode="thread"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "0 to 1,000 users in 60 days. $0 ad spend. Here's the exact 3-channel playbook we used (with conversion data at each stage):",
      "emojis": ["🚀"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Channel 1: ProductHunt launch. Prep: 30 days of teaser tweets, 40 'beta tester' warm intros, launch video. Results: #2 product of day, 4.2K visitors, 312 signups (7.4% conv), 89 activated (28.5%). Takeaway: Pre-launch > launch day.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Channel 2: Content SEO. Strategy: 'How to [job] without [expensive tool]' format. 12 articles, avg 1,200 words. Month 1: 40 visitors. Month 2: 890 visitors, 67 signups (7.5% conv). Compounding effect is real but slow.",
      "emojis": ["📝"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Channel 3: Twitter DMs (non-spammy). Found 200 people tweeting about problem we solve. Replied publicly with value, then DMed: 'Made a tool for this exact problem, want early access?' 43% opened, 18% signed up. 156 users from this.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Conversion funnel: 1,000 users → 340 activated (34%) → 89 paid trial (26%) → 34 converted (38%) = $2.1K MRR. Biggest drop-off: activation (66% never completed setup). We fixed with onboarding checklist, now at 51% activation.",
      "emojis": ["📊"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Key insight: We obsessed over tactics, ignored activation. Getting users is easy. Getting them to value is hard. If you're pre-1K users, reply with your biggest growth challenge. I'll share what worked for similar situations.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "12K-45K (detailed data + playbook + case study)",
  "publishTips": "Post Tuesday 10 AM EST. Create simple funnel visual. Engage deeply with replies asking questions."
}

EXAMPLE 5 - HIGH QUALITY Single Viral Post (Score: 89/100):
INPUT: draft="Productivity hack", refinePrompt="quick win", style="inspirational", mode="single"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "I wasted 6 months on the wrong features. Then I started this 5-minute daily habit: Every morning, I tweet 'Working on X today because customer Y said Z.' Forces me to tie every task to a real user need. Shipped 3x faster, zero wasted code. Try it tomorrow.",
      "emojis": ["⚡"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "5K-20K (quick actionable insight + personal proof)",
  "publishTips": "Post 6-7 AM EST (early morning scroll). Keep it punchy. Pin for 24 hours if it gains traction."
}

EXAMPLE 6 - HIGH QUALITY Founder Journey (Score: 96/100):
INPUT: draft="Quit job to build startup", refinePrompt="emotional story", style="narrative", mode="thread"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "$140K/year Google job. Quit to build a SaaS. 9 months later: $2.3K MRR, $847 in my bank account, questioning everything. Here's what they don't tell you about going full-time indie:",
      "emojis": ["😰"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Month 1-3: The honeymoon. Wake up at 5 AM energized. Ship features. Feel like a genius. $0 revenue but 'it's early.' Savings: $32K left. Confidence: 11/10.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Month 4-6: Reality hits. First paying customer ($29/mo) feels like winning the lottery. Then they churn. Realize I'm solving my own problem, not theirs. Rebuild core feature 3x. Savings: $18K. Confidence: 4/10. Sleep: nonexistent.",
      "emojis": ["💀"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Month 7: Breaking point. $847 MRR, rent due, considering 'real jobs.' Wife finds me crying over laptop at 2 AM. She says: 'What's the smallest thing you can do tomorrow that users will pay for?' Changed everything.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Stopped building 'cool features.' Started solving urgent problems. Built a simple CSV export feature in 4 hours. 6 customers paid $49 for it in first week. Lesson: Desperate needs > nice-to-haves.",
      "emojis": ["💡"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Month 9: $2.3K MRR. Not enough to survive, but enough to know it's possible. Bank account terrifies me daily. But I'm solving real problems now. If you're in the messy middle of your startup, you're not alone. DM me if you need to talk to someone who gets it.",
      "emojis": ["🫂"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "20K-100K (extreme vulnerability + relatable struggle + raw emotion)",
  "publishTips": "Post Wednesday 7 PM EST (evening scroll, emotional connection). Share when you're ready to be vulnerable. This type goes viral on authenticity."
}

EXAMPLE 7 - HIGH QUALITY Quick Tactical Win (Score: 87/100):
INPUT: draft="Landing page conversion tip", refinePrompt="specific tactic", style="data-driven", mode="single"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Changed our landing page headline from 'The best project management tool' to 'Ship projects 3x faster without meetings.' Conversion: 2.1% → 8.7%. Specificity > generic claims. Your headline should answer: faster/cheaper/easier + without [pain]. Test it this week.",
      "emojis": ["📈"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "3K-15K (specific data + actionable formula)",
  "publishTips": "Post 12-1 PM EST (lunch break browsing). Include before/after screenshot if possible."
}

EXAMPLE 8 - HIGH QUALITY Controversial Take (Score: 94/100):
INPUT: draft="VC funding is a trap", refinePrompt="strong opinion", style="contrarian", mode="thread"
OUTPUT:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Unpopular opinion: VC funding destroyed my first startup and saved my second. The difference wasn't the money—it was my readiness. Here's how to know if you should raise (most founders get this wrong):",
      "emojis": ["⚠️"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "First startup: Raised $2M seed at $0 MRR. 'Idea was hot.' Hired 8 people in month 1. Fancy office, ping pong table, catered lunches. Burned $140K/month. 18 months later: shut down with $0 revenue. I had money, no market.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Second startup: Bootstrapped to $40K MRR first. Raised $5M Series A. Used it for sales team + infrastructure, not 'figuring out product-market fit.' 24 months later: $2.4M ARR, profitable. Had market, needed money to scale.",
      "emojis": ["📈"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "The test: Can you clearly articulate (1) who pays you, (2) what specific pain you solve, (3) why you're 10x better than alternatives, (4) your unit economics? If yes to all 4, raise. If no to any, bootstrap longer.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "VC money isn't evil. It's rocket fuel. But rocket fuel only works if you have a rocket. Otherwise, it's just an expensive explosion. Most founders confuse 'I need money' with 'I need to figure out my business.'",
      "emojis": ["🚀"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "If you're considering raising, reply with where you're at. I'll tell you honestly if you're ready or if you should bootstrap longer. No BS, just pattern-matching from my $2M mistake.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "25K-120K (controversial + personal failure + framework)",
  "publishTips": "Post Monday 8 AM EST (start of week, high engagement). Expect debate in replies—engage with both supporters and critics authentically."
}
`;
