/**
 * Viral hook templates based on proven formulas
 * Formula: Bold Statement + Tension + Twist + Credibility
 */

export const hookTemplates = {
  vulnerability: [
    "I [big failure/loss]. [Time period] later: [surprising recovery/win]. Here's what [nobody tells you/I learned]:",
    "[High status thing] to [low status thing]. [Specific metric]. [Emotion]. Here's [what happened/lesson]:",
    "I spent [time/money] on [thing]. [Terrible result]. Then I [simple change]. [Amazing result]. The story:",
  ],

  contrarian: [
    "Everyone says [popular belief]. I [did opposite]. [Surprising positive result]. [Popular belief] isn't wrong—[your nuance]. Here's why:",
    "Unpopular opinion: [controversial statement]. [Proof/data]. Here's what [most people] get wrong:",
    "[Everyone/Gurus] tell you to [common advice]. I did [exactly that]. [It failed/succeeded] for [unexpected reason]. The truth:",
  ],

  dataProof: [
    "I tested [number] [things]. [Most] failed. These [few] actually worked [and cost/made $X]. [Format: thread/breakdown/data]:",
    "[Specific number] [unit of work]. [Impressive result]. $[amount] [spent/earned]. Here's the exact [breakdown/playbook]:",
    "[Time period]: [Starting metric] → [Ending metric]. [Action taken]. Here's every [step/mistake/win]:",
  ],

  caseStudy: [
    "[Starting point] to [end point] in [timeframe]. [Unique constraint]. Here's the exact [system/playbook]:",
    "How we [achieved impressive result] [with constraint]. [Counter-intuitive approach]. The [step-by-step/breakdown]:",
    "[Number] [days/weeks/months]. [Starting number] → [ending number]. [Specific strategy]. Here's what worked:",
  ],

  storytelling: [
    "[Dramatic moment/decision]. [Stakes/fear]. [What happened]. Here's the [story/lesson]:",
    "[Specific day/time], [unexpected event]. Changed [everything/my perspective]. Here's why:",
    "They told me [pessimistic prediction]. [Timeframe] later: [proved them wrong with metric]. The [journey/lesson]:",
  ],

  listicle: [
    "I [tested/tried/built] [number] [things]. [Number] [failed/worked]. [These/Here are the] [number that worked] [with results]:",
    "[Number] [things] that [result]. [Number] cost $0. [Number] take [short time]. Thread:",
    "[Time period], [number] [experiments/tactics/hacks]. Only [number] actually [worked/moved the needle]. The breakdown:",
  ],

  question: [
    "Why do [number]% of [people] [fail at thing]? [Surprising reason]. Here's [how to avoid it/the pattern]:",
    "What's the difference between [successful people] at [metric] vs [struggling people] at [metric]? [Counter-intuitive answer]. The breakdown:",
    "How do you [achieve hard goal] when [common constraint]? [Unexpected method]. Here's exactly how:",
  ],

  curiosityGap: [
    "This [simple thing] [resulted in impressive outcome]. [99% of people] don't know [it/this]. [What I learned/The breakdown]:",
    "The [number]-[unit] [thing] that [impressive result]. [Sounds like X], actually [Y]. Here's why it works:",
    "[Surprising observation]. Nobody talks about this. Here's what's really happening:",
  ],

  urgency: [
    "[Something] is [changing/dying/breaking]. [Timeframe]. [Consequence if you don't act]. Here's [what to do/how to prepare]:",
    "If you're [doing common thing], stop. [Reason]. [Better alternative]. The playbook:",
    "You have [timeframe] to [do thing] before [consequence]. Here's why [and what to do]:",
  ],

  achievement: [
    "Just hit [impressive milestone]. [Timeframe]. [Starting point]. Here's every [mistake/lesson/tactic]:",
    "[Impressive achievement] without [thing everyone thinks you need]. Instead: [your approach]. The breakdown:",
    "From [low starting point] to [high end point]. [No fancy thing]. Just [simple system]. Thread:",
  ],
};

/**
 * Get appropriate hook templates for a given style
 */
export function getHookTemplatesForStyle(style: string): string[] {
  const styleMap: Record<string, keyof typeof hookTemplates> = {
    raw: 'storytelling',
    funny: 'vulnerability',
    inspirational: 'achievement',
    'data-driven': 'dataProof',
    teaser: 'curiosityGap',
    narrative: 'storytelling',
    listicle: 'listicle',
    'question-based': 'question',
    contrarian: 'contrarian',
  };

  const hookType = styleMap[style] || 'storytelling';
  return hookTemplates[hookType];
}

/**
 * Hook quality validation checklist
 */
export const hookQualityCriteria = {
  hasBoldStatement: "Opens with surprising/shocking/contrarian statement",
  hasTension: "Includes struggle, pain point, or challenge",
  hasTwist: "Contains unexpected insight or counter-intuitive element",
  hasCredibility: "Includes specific numbers, metrics, or proof",
  hasSpecificity: "Avoids generic terms, uses concrete details",
  createsCuriosity: "Makes reader want to know 'how' or 'why'",
  isConversational: "Sounds human, not robotic or corporate",
  hasClearPromise: "Sets expectation for what thread will deliver",
};

/**
 * CTA templates that feel natural and specific
 */
export const ctaTemplates = {
  feedback: [
    "If you're [in similar situation], reply with [your specific challenge]. I'll share what worked for [similar cases].",
    "Working on [related thing]? Drop a reply and I'll give you honest feedback.",
    "Reply with [your biggest question] about this and I'll answer with what I learned.",
  ],

  resource: [
    "Want the [template/playbook/checklist]? Reply '[keyword]' and I'll DM you the doc.",
    "I made a [resource] with the full breakdown. Reply and I'll send it over.",
    "Created a [tool/template] for this exact thing. DM me '[keyword]' if you want it.",
  ],

  conversation: [
    "What's your take on this? I'd love to hear [different perspectives/if this matches your experience].",
    "Anyone else [experiencing this]? Let's compare notes in the replies.",
    "Curious: [question related to thread topic]? Reply with your experience.",
  ],

  vulnerability: [
    "If you're in the messy middle of [situation], you're not alone. DM me if you need to talk to someone who gets it.",
    "Been there? Let's commiserate in the replies. [Shared struggle] is real.",
    "Still figuring this out. If you've cracked [problem], reply with what worked for you.",
  ],

  value: [
    "Bookmark this if you're [about to do X]. You'll want these [lessons/tactics] when [situation].",
    "Save this thread for when you [hit this stage]. Future you will thank present you.",
    "Share this with someone who's [in this situation]. They'll appreciate it.",
  ],

  continuation: [
    "This is part of my [build in public/founder journey]. Following along? [Link to profile/previous thread].",
    "Want more [type of content]? I share [frequency] updates on [topic].",
    "If this was helpful, I write about [topic] weekly. [Follow/Subscribe] for more.",
  ],
};

/**
 * Get appropriate CTA for style and content
 */
export function getCtaTemplateForContext(
  style: string,
  hasResource: boolean,
  threadTopic: string
): string[] {
  if (hasResource) return ctaTemplates.resource;

  const styleCtaMap: Record<string, keyof typeof ctaTemplates> = {
    raw: 'vulnerability',
    funny: 'conversation',
    inspirational: 'value',
    'data-driven': 'feedback',
    narrative: 'vulnerability',
    listicle: 'resource',
    teaser: 'conversation',
    'question-based': 'feedback',
  };

  const ctaType = styleCtaMap[style] || 'conversation';
  return ctaTemplates[ctaType];
}
