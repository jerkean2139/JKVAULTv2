import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Projects
  const projects = await Promise.all([
    prisma.project.upsert({ where: { name: "Kean on Biz" }, update: {}, create: { name: "Kean on Biz", description: "Business coaching and strategy content", color: "#6366f1", icon: "briefcase" } }),
    prisma.project.upsert({ where: { name: "Zenoflo" }, update: {}, create: { name: "Zenoflo", description: "Mindset, flow state, and personal development", color: "#8b5cf6", icon: "brain" } }),
    prisma.project.upsert({ where: { name: "Agent Mob" }, update: {}, create: { name: "Agent Mob", description: "Insurance agent community and training", color: "#ec4899", icon: "users" } }),
    prisma.project.upsert({ where: { name: "Manumation" }, update: {}, create: { name: "Manumation", description: "Manual + automation systems and processes", color: "#14b8a6", icon: "cog" } }),
    prisma.project.upsert({ where: { name: "State Farm Coaching" }, update: {}, create: { name: "State Farm Coaching", description: "State Farm agent coaching program", color: "#f97316", icon: "shield" } }),
    prisma.project.upsert({ where: { name: "Empire Title" }, update: {}, create: { name: "Empire Title", description: "Title company operations and growth", color: "#eab308", icon: "building" } }),
    prisma.project.upsert({ where: { name: "Personal Growth" }, update: {}, create: { name: "Personal Growth", description: "Personal development and self-improvement", color: "#22c55e", icon: "heart" } }),
    prisma.project.upsert({ where: { name: "Research Vault" }, update: {}, create: { name: "Research Vault", description: "Collected research, references, and deep dives", color: "#64748b", icon: "archive" } }),
  ]);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Sales" }, update: {}, create: { name: "Sales", description: "Sales techniques, closing, and pipeline" } }),
    prisma.category.upsert({ where: { name: "Marketing" }, update: {}, create: { name: "Marketing", description: "Marketing strategies and brand building" } }),
    prisma.category.upsert({ where: { name: "Leadership" }, update: {}, create: { name: "Leadership", description: "Leadership, management, and team building" } }),
    prisma.category.upsert({ where: { name: "Systems" }, update: {}, create: { name: "Systems", description: "Systems thinking and business systems" } }),
    prisma.category.upsert({ where: { name: "Operations" }, update: {}, create: { name: "Operations", description: "Business operations and efficiency" } }),
    prisma.category.upsert({ where: { name: "Mindset" }, update: {}, create: { name: "Mindset", description: "Mindset, psychology, and mental models" } }),
    prisma.category.upsert({ where: { name: "AI" }, update: {}, create: { name: "AI", description: "Artificial intelligence and automation" } }),
    prisma.category.upsert({ where: { name: "Prompting" }, update: {}, create: { name: "Prompting", description: "AI prompting and prompt engineering" } }),
    prisma.category.upsert({ where: { name: "Storytelling" }, update: {}, create: { name: "Storytelling", description: "Narrative, copywriting, and storytelling" } }),
    prisma.category.upsert({ where: { name: "Offer Creation" }, update: {}, create: { name: "Offer Creation", description: "Product offers, pricing, and packaging" } }),
    prisma.category.upsert({ where: { name: "Coaching" }, update: {}, create: { name: "Coaching", description: "Coaching methodology and client development" } }),
    prisma.category.upsert({ where: { name: "Faith / Philosophy" }, update: {}, create: { name: "Faith / Philosophy", description: "Faith, philosophy, and deeper purpose" } }),
    prisma.category.upsert({ where: { name: "Processes" }, update: {}, create: { name: "Processes", description: "Process design and workflow optimization" } }),
  ]);

  // Tags
  const tagNames = ["hooks", "persuasion", "frameworks", "tactics", "mindset-shift", "contrarian", "storytelling", "authority", "engagement", "viral", "educational", "motivational", "practical", "deep-dive", "quick-tip"];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  // Creators
  const creators = await Promise.all([
    prisma.creator.upsert({
      where: { id: "creator-alex-hormozi" },
      update: {},
      create: {
        id: "creator-alex-hormozi",
        name: "Alex Hormozi",
        platform: "youtube",
        pageUrl: "https://youtube.com/@AlexHormozi",
        description: "Business acquisition and scaling expert",
        toneNotes: "Direct, high-energy, uses frameworks, no-BS approach",
        topicFocus: "Business acquisition, offers, sales, scaling",
        trustLevel: "trusted",
        styleFingerprintJson: { toneWords: ["direct", "intense", "framework-heavy"], hookStyle: "bold claim + proof", structure: "problem-framework-action", vocabulary: "business-technical", delivery: "high-energy" },
      },
    }),
    prisma.creator.upsert({
      where: { id: "creator-simon-sinek" },
      update: {},
      create: {
        id: "creator-simon-sinek",
        name: "Simon Sinek",
        platform: "youtube",
        pageUrl: "https://youtube.com/@SimonSinek",
        description: "Leadership and inspiration thought leader",
        toneNotes: "Calm, thoughtful, story-driven, empathetic",
        topicFocus: "Leadership, purpose, team culture",
        trustLevel: "trusted",
        styleFingerprintJson: { toneWords: ["thoughtful", "empathetic", "inspiring"], hookStyle: "question or story opening", structure: "story-insight-principle", vocabulary: "accessible", delivery: "calm-authoritative" },
      },
    }),
    prisma.creator.upsert({
      where: { id: "creator-gary-vee" },
      update: {},
      create: {
        id: "creator-gary-vee",
        name: "Gary Vaynerchuk",
        platform: "youtube",
        pageUrl: "https://youtube.com/@garyvee",
        description: "Entrepreneur and social media marketing expert",
        toneNotes: "Passionate, street-smart, empathetic but blunt",
        topicFocus: "Social media, entrepreneurship, personal branding",
        trustLevel: "trusted",
        styleFingerprintJson: { toneWords: ["passionate", "real", "blunt"], hookStyle: "provocative statement", structure: "rant-insight-action", vocabulary: "conversational", delivery: "high-energy-conversational" },
      },
    }),
    prisma.creator.upsert({
      where: { id: "creator-codie-sanchez" },
      update: {},
      create: {
        id: "creator-codie-sanchez",
        name: "Codie Sanchez",
        platform: "youtube",
        pageUrl: "https://youtube.com/@CodieSanchez",
        description: "Boring business acquisition and contrarian investing",
        toneNotes: "Smart, contrarian, data-backed, accessible",
        topicFocus: "Boring businesses, acquisition, cash flow",
        trustLevel: "trusted",
        styleFingerprintJson: { toneWords: ["smart", "contrarian", "accessible"], hookStyle: "contrarian insight + data", structure: "myth-bust-framework-proof", vocabulary: "business-casual", delivery: "confident-analytical" },
      },
    }),
  ]);

  // Content Items (sample processed content)
  const content1 = await prisma.contentItem.create({
    data: {
      sourceType: "youtube",
      sourceUrl: "https://youtube.com/watch?v=sample1",
      title: "How to Build a $100M Offer",
      creatorNameRaw: "Alex Hormozi",
      thumbnailUrl: "/placeholder-thumb.jpg",
      rawText: "Today I'm going to teach you how to create an offer so good that people feel stupid saying no...",
      transcriptText: "Today I'm going to teach you how to create an offer so good that people feel stupid saying no. The framework is simple. First, identify the dream outcome your customer wants. Second, figure out the perceived likelihood of achievement. Third, minimize the time delay. Fourth, minimize the effort and sacrifice required. When you maximize the top and minimize the bottom, you get a grand slam offer.",
      shortSummary: "Hormozi's Grand Slam Offer framework: maximize dream outcome and perceived likelihood while minimizing time delay and effort/sacrifice.",
      detailedSummary: "Alex Hormozi breaks down his signature offer creation framework. A Grand Slam Offer combines four elements: the dream outcome (what the customer truly wants), perceived likelihood of achievement (how likely they believe success is), time delay (how long until results), and effort/sacrifice (what they must give up). By maximizing the numerator (dream outcome + likelihood) and minimizing the denominator (time + effort), you create an irresistible offer. He emphasizes that most businesses compete on price because their offer is commodity-level.",
      hookAnalysisJson: { hook: "An offer so good people feel stupid saying no", type: "bold_promise", strength: 9, psychologicalTrigger: "curiosity + fear of missing out" },
      persuasionAngle: "Authority + Framework: Positions himself as someone who has done this repeatedly at scale, then gives a clear mental model that makes the audience feel empowered to act.",
      usefulVsFluffJson: { useful: 85, fluff: 15, breakdown: "Strong framework content with specific variables. Minor fluff in intro/outro." },
      businessTakeawaysJson: ["Create offers based on value equation not price", "Focus on dream outcome clarity", "Reduce perceived risk for customers", "Speed of result delivery matters more than most think"],
      categorizationReasoning: "Primary: Offer Creation (direct framework for building offers). Secondary: Sales (relates to closing and conversion). Also relevant to Marketing (positioning).",
      tagsJson: ["frameworks", "persuasion", "tactics", "practical"],
      energyStyle: "high-energy",
      audienceFit: "Business owners, coaches, service providers",
      status: "reviewed",
      projectId: projects[0].id,
      savedCreatorId: creators[0].id,
    },
  });

  await prisma.contentItemCategory.createMany({
    data: [
      { contentItemId: content1.id, categoryId: categories[9].id, confidenceScore: 0.95 },
      { contentItemId: content1.id, categoryId: categories[0].id, confidenceScore: 0.75 },
      { contentItemId: content1.id, categoryId: categories[1].id, confidenceScore: 0.6 },
    ],
  });

  const content2 = await prisma.contentItem.create({
    data: {
      sourceType: "youtube",
      sourceUrl: "https://youtube.com/watch?v=sample2",
      title: "Start With Why - Leadership Lesson",
      creatorNameRaw: "Simon Sinek",
      rawText: "People don't buy what you do, they buy why you do it...",
      transcriptText: "People don't buy what you do, they buy why you do it. Every single organization on the planet knows what they do. Some know how they do it. Very few know why they do it. And by why, I don't mean to make money. That's a result. By why I mean what's your purpose, what's your cause, what's your belief.",
      shortSummary: "Sinek's Golden Circle: organizations that start with WHY (purpose/belief) inspire action, while those that start with WHAT just inform.",
      detailedSummary: "Simon Sinek presents the Golden Circle framework showing that inspired leaders and organizations all think, act, and communicate from the inside out - starting with WHY. Most companies communicate what they do, then how, but rarely why. The brain's limbic system (responsible for feelings, trust, and decision-making) responds to WHY, while the neocortex (rational thought) responds to WHAT. This is why facts and features don't drive loyalty.",
      hookAnalysisJson: { hook: "People don't buy what you do, they buy why you do it", type: "paradigm_shift", strength: 10, psychologicalTrigger: "reframing + insight" },
      persuasionAngle: "Paradigm Shift: Challenges the audience's default assumption about how selling/leading works and replaces it with a more compelling model.",
      usefulVsFluffJson: { useful: 80, fluff: 20, breakdown: "Strong conceptual framework. Some repetition in examples." },
      businessTakeawaysJson: ["Lead with purpose not product", "Inspire through belief not features", "Build trust through WHY", "Decisions are emotional then rationalized"],
      categorizationReasoning: "Primary: Leadership (core message about leading with purpose). Secondary: Marketing (how to communicate brand), Storytelling (narrative-driven approach).",
      tagsJson: ["frameworks", "storytelling", "authority", "deep-dive"],
      energyStyle: "calm-authoritative",
      audienceFit: "Leaders, coaches, entrepreneurs",
      status: "favorite",
      projectId: projects[1].id,
      savedCreatorId: creators[1].id,
    },
  });

  await prisma.contentItemCategory.createMany({
    data: [
      { contentItemId: content2.id, categoryId: categories[2].id, confidenceScore: 0.9 },
      { contentItemId: content2.id, categoryId: categories[1].id, confidenceScore: 0.7 },
      { contentItemId: content2.id, categoryId: categories[8].id, confidenceScore: 0.65 },
    ],
  });

  const content3 = await prisma.contentItem.create({
    data: {
      sourceType: "manual_text",
      title: "5 Systems Every Agency Needs",
      rawText: "After building and coaching hundreds of insurance agencies, I've found that every successful agency runs on five core systems: lead generation, follow-up automation, client onboarding, retention workflows, and team accountability loops.",
      shortSummary: "Five essential agency systems: lead gen, follow-up automation, client onboarding, retention, and team accountability.",
      detailedSummary: "A practical breakdown of the five operational systems that separate thriving insurance agencies from struggling ones. Each system is interconnected - lead generation feeds follow-up, which feeds onboarding, which feeds retention, which creates referrals back into lead gen. Team accountability ties it all together.",
      hookAnalysisJson: { hook: "After building and coaching hundreds of agencies", type: "authority_proof", strength: 7, psychologicalTrigger: "social proof + authority" },
      persuasionAngle: "Experience Authority: Uses track record to establish credibility before delivering tactical advice.",
      usefulVsFluffJson: { useful: 90, fluff: 10, breakdown: "Highly tactical with named systems. Minimal filler." },
      businessTakeawaysJson: ["Build interconnected systems not isolated tools", "Lead gen without follow-up is waste", "Retention is cheaper than acquisition", "Accountability makes systems work"],
      categorizationReasoning: "Primary: Systems (directly about building business systems). Secondary: Operations, Processes. Related to Coaching (coaching agencies).",
      tagsJson: ["frameworks", "tactics", "practical", "quick-tip"],
      energyStyle: "tactical",
      audienceFit: "Insurance agents, agency owners",
      status: "draft",
      projectId: projects[4].id,
    },
  });

  await prisma.contentItemCategory.createMany({
    data: [
      { contentItemId: content3.id, categoryId: categories[3].id, confidenceScore: 0.95 },
      { contentItemId: content3.id, categoryId: categories[4].id, confidenceScore: 0.85 },
      { contentItemId: content3.id, categoryId: categories[12].id, confidenceScore: 0.8 },
    ],
  });

  // Generated Outputs
  await prisma.generatedOutput.create({
    data: {
      contentItemId: content1.id,
      projectId: projects[0].id,
      outputType: "facebook_post",
      title: "Stop Competing on Price",
      outputText: "Stop competing on price.\n\nHere's why most businesses are stuck in a race to the bottom:\n\nThey sell WHAT they do instead of the OUTCOME they deliver.\n\nThe fix? Build an offer around these 4 things:\n\n1. Dream Outcome - What does the customer ACTUALLY want?\n2. Perceived Likelihood - How confident are they it'll work?\n3. Time to Result - How fast will they see it?\n4. Effort Required - How easy is it for them?\n\nMaximize 1 and 2. Minimize 3 and 4.\n\nThat's it. That's the entire offer equation.\n\nWhen you nail all four, price becomes irrelevant.\n\nWhat's one thing you could change about your offer today to increase perceived likelihood?",
      originalityLevel: "medium",
      toneMode: "tactical",
      contentMode: "educational",
      audience: "Small business owners",
      reviewStatus: "reviewed",
      feedbackStatus: "nailed_it",
    },
  });

  await prisma.generatedOutput.create({
    data: {
      contentItemId: content1.id,
      projectId: projects[0].id,
      outputType: "green_screen_script",
      title: "Grand Slam Offer Breakdown - Green Screen",
      outputText: JSON.stringify({
        openingHook: "Most businesses compete on price because their offer sucks. Let me show you the exact framework to fix that.",
        onScreenAsset: "Show the value equation: (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort & Sacrifice)",
        beats: [
          { script: "So here's the thing - most businesses are stuck in a race to the bottom on price. And the reason is simple: their offer is a commodity.", sceneNote: "Speaker on camera, no graphic yet", gesture: "Lean in, palms up", bRoll: "Stock footage of price comparison shopping" },
          { script: "But there's a framework that changes everything. It's called the Value Equation.", sceneNote: "Bring up equation graphic behind speaker", gesture: "Point to screen", bRoll: "Equation appears" },
          { script: "Dream Outcome - what does your customer actually want? Not your product. The RESULT.", sceneNote: "Highlight Dream Outcome on equation", gesture: "Emphasize with hand counting", bRoll: "Before/after transformation images" },
          { script: "Perceived Likelihood - do they believe it'll actually work for THEM?", sceneNote: "Highlight Perceived Likelihood", gesture: "Point to audience", bRoll: "Testimonial screenshots" },
          { script: "Now minimize the bottom. Time Delay - how fast can they see results? And Effort - how easy is it for them?", sceneNote: "Highlight bottom of equation", gesture: "Push down motion", bRoll: "Clock ticking, easy button" },
        ],
        cta: "Comment 'OFFER' and I'll send you the full framework breakdown.",
        shortVersion: "Most offers compete on price because they're commodity-level. Fix it with the Value Equation: maximize dream outcome and likelihood, minimize time and effort. Your offer should be so good people feel stupid saying no.",
        expandedVersion: "Full 5-minute version with additional examples and case studies from real businesses who transformed their offers using this framework.",
      }),
      originalityLevel: "medium",
      toneMode: "educational",
      contentMode: "tactical",
      audience: "Business owners",
      reviewStatus: "ready_to_record",
    },
  });

  await prisma.generatedOutput.create({
    data: {
      contentItemId: content2.id,
      projectId: projects[1].id,
      outputType: "talking_head_script",
      title: "Why Most Leaders Get It Backwards",
      outputText: "[HOOK]\nEvery leader I've coached who's struggling has the same problem - they're communicating backwards.\n\n[SETUP]\nHere's what I mean. Most leaders walk into a room and say 'Here's what we do, here's how we do it, want to join us?'\n\nBut the best leaders? They start with WHY.\n\n[CORE INSIGHT]\nYour team doesn't care about your processes until they care about your PURPOSE.\n\nSimon Sinek calls this the Golden Circle. But here's how I teach it to my coaching clients:\n\nBefore your next team meeting, answer this: 'If we shut down tomorrow, what would the world lose?'\n\nTHAT'S your why. Lead with that.\n\n[TACTICAL TAKEAWAY]\nThis week, try this: Start every conversation with your belief, not your product. Watch what changes.\n\n[CTA]\nWhat's your WHY? Drop it in the comments - I'll tell you if it's a real WHY or just a dressed-up WHAT.",
      originalityLevel: "high",
      toneMode: "educational",
      contentMode: "story_driven",
      audience: "Coaches & consultants",
      reviewStatus: "draft",
    },
  });

  // Trend Topics
  await prisma.trendTopic.createMany({
    data: [
      { topicArea: "ai", headline: "AI Agents Are Replacing SaaS Tools", summary: "The rise of AI agents that can autonomously complete complex business tasks is reshaping the SaaS landscape. Companies are building agent-based workflows instead of buying traditional software.", score: 92, isRising: true, isOverused: false, source: "tech-trends" },
      { topicArea: "ai", headline: "Prompt Engineering Is Dead - Long Live Prompt Architecture", summary: "As AI models become more capable, simple prompting gives way to complex prompt architectures and chains of thought.", score: 78, isRising: true, isOverused: false, source: "industry-analysis" },
      { topicArea: "coaching", headline: "Group Coaching Models Outperform 1:1", summary: "Coaches transitioning from 1:1 to group models are seeing higher revenue and better client outcomes through peer accountability.", score: 85, isRising: true, isOverused: false, source: "coaching-industry" },
      { topicArea: "coaching", headline: "Certification Fatigue in Coaching Industry", summary: "The market is oversaturated with coaching certifications. Clients are choosing coaches based on results and personality rather than credentials.", score: 65, isRising: false, isOverused: true, source: "coaching-industry" },
      { topicArea: "marketing", headline: "Short-Form Video Still Dominates Attention", summary: "Sub-60 second video content continues to drive the highest engagement rates across all platforms.", score: 88, isRising: false, isOverused: true, source: "marketing-data" },
      { topicArea: "marketing", headline: "Community-Led Growth Replacing Paid Ads", summary: "Brands are investing in owned communities as CAC for paid advertising continues to rise.", score: 82, isRising: true, isOverused: false, source: "marketing-data" },
      { topicArea: "leadership", headline: "Remote Leadership Skills Gap", summary: "Leaders who mastered in-person management are struggling with remote team dynamics, creating demand for new leadership frameworks.", score: 71, isRising: true, isOverused: false, source: "leadership-analysis" },
      { topicArea: "systems", headline: "No-Code Automation Democratizing Operations", summary: "Tools like Make, Zapier, and n8n are enabling non-technical operators to build sophisticated business automation.", score: 80, isRising: true, isOverused: false, source: "tech-trends" },
      { topicArea: "mindset", headline: "Nervous System Regulation in Business", summary: "Entrepreneurs are adopting somatic practices and nervous system work to improve decision-making under pressure.", score: 73, isRising: true, isOverused: false, source: "wellness-business" },
      { topicArea: "processes", headline: "SOPs as Competitive Advantage", summary: "Companies documenting and optimizing standard operating procedures are scaling faster and more predictably.", score: 76, isRising: true, isOverused: false, source: "operations-analysis" },
    ],
  });

  // App Settings (default voice/methodology)
  await prisma.appSetting.upsert({
    where: { key: "methodology" },
    update: {},
    create: {
      key: "methodology",
      valueJson: {
        name: "My Methodology",
        description: "A practical, systems-driven approach to business growth that combines tactical execution with mindset mastery.",
        toneNotes: "Direct but approachable. Use frameworks and numbered lists. Be tactical, not theoretical. Sound like a coach who's been in the trenches.",
        prohibitedPhrases: ["game-changer", "synergy", "disrupt", "hustle culture", "grind", "crushing it"],
        preferredPhrases: ["here's the play", "tactical breakdown", "the framework", "real talk", "in the trenches"],
        audiences: ["State Farm agents", "Small business owners", "Coaches & consultants"],
        contentGoals: "Build authority, drive engagement, generate leads for coaching programs",
        brandThemes: ["systems over hustle", "clarity over complexity", "execution over theory"],
        defaultOriginalityLevel: "high",
        defaultCtaStyles: ["question-based", "comment-trigger", "DM-based"],
      },
    },
  });

  await prisma.appSetting.upsert({
    where: { key: "preferences" },
    update: {},
    create: {
      key: "preferences",
      valueJson: {
        defaultOutputFormat: "facebook_post",
        reviewWorkflow: true,
        autoSimilarityCheck: true,
        defaultAudience: "Small business owners",
        exportFormat: "markdown",
      },
    },
  });

  // Notes
  await prisma.note.create({
    data: {
      contentItemId: content1.id,
      body: "Great framework to reference in offer creation content. Could adapt the value equation visual for green screen videos.",
    },
  });

  console.log("Seed completed successfully!");
  console.log(`Created: ${projects.length} projects, ${categories.length} categories, ${tags.length} tags, ${creators.length} creators, 3 content items, 3 generated outputs, 10 trend topics, 2 app settings`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
