import { isMockMode } from "@/lib/utils/mock-mode";
import { chatCompletion } from "./openai-client";

export interface GenerationInput {
  sourceTexts: string[];
  outputType: string;
  contentMode?: string;
  audience?: string;
  originalityLevel?: string;
  meshWithMethodology?: boolean;
  methodologySettings?: Record<string, unknown>;
  toneNotes?: string;
  creatorStyle?: string;
}

export interface GenerationResult {
  title: string;
  outputText: string;
  similarityScore?: number;
}

const MOCK_OUTPUTS: Record<string, GenerationResult> = {
  content_idea: {
    title: "The Hidden Cost of Not Having Systems",
    outputText: "CONTENT IDEA: The Hidden Cost of Not Having Systems\n\nAngle: Most business owners think systems are a luxury. Show them it's actually the most expensive thing they're NOT doing.\n\nHook options:\n1. \"You're bleeding money every day and don't even know it\"\n2. \"The #1 thing separating 6-figure from 7-figure businesses isn't talent\"\n3. \"I asked 50 agency owners what their biggest expense was. None of them got it right.\"\n\nKey points to cover:\n- Calculate the cost of repeated mistakes\n- Show the compound effect of undocumented processes\n- Give one quick-win system they can build today\n\nCTA: Ask audience what process they repeat most often",
  },
  facebook_post: {
    title: "Stop Building, Start Systemizing",
    outputText: "Stop building more.\nStart systemizing what you have.\n\nI see this every week with the agency owners I coach:\n\nThey add another product.\nAnother service.\nAnother initiative.\n\nBut they never systemize the ones already working.\n\nHere's the truth most won't tell you:\n\nYour business doesn't need more offers.\nIt needs better operations on your CURRENT offers.\n\nThis week, pick ONE thing that's working and ask:\n\"How do I make this run without me touching it?\"\n\nThat's where real growth starts.\n\nWhat's the one thing in your business that works but only because YOU make it work? Drop it below.",
  },
  discussion_post: {
    title: "Hot Take: Systems vs Hustle",
    outputText: "Hot take: The 'hustle harder' era is over.\n\nI've coached hundreds of agents and business owners. The ones who scale are never the hardest workers.\n\nThey're the best SYSTEMIZERS.\n\nHere's what I mean:\n\nHard worker: Does 50 follow-up calls a day manually\nSystemizer: Builds an automated follow-up sequence that does 200/day\n\nHard worker: Personally trains every new hire\nSystemizer: Creates an onboarding system that trains itself\n\nThe difference isn't effort. It's architecture.\n\nAgree or disagree? I'd love to hear your take.",
  },
  email: {
    title: "The One System That Changed Everything",
    outputText: "Subject: The one system that changed everything\n\nHey [NAME],\n\nQuick question: How many times this week did you explain the same thing to different people?\n\nIf the answer is more than once, you have a systems problem.\n\nI used to be the bottleneck in every process. Sound familiar?\n\nHere's the fix that took me from working 70-hour weeks to 35:\n\nI documented my top 5 repeated tasks as simple SOPs.\n\nThat's it. No fancy software. No expensive consultants.\n\nJust clear, written steps for the things I did over and over.\n\nWithin 30 days, my team was handling 80% of what used to require me.\n\nWant to see the exact template I use? Reply 'SYSTEMS' and I'll send it over.\n\nTalk soon,\n[Your name]",
  },
  talking_head_script: {
    title: "Why Your Business Is Stuck",
    outputText: "[HOOK]\nIf your business can't run without you for one week, you don't have a business - you have a job.\n\n[SETUP - 15 sec]\nI've coached hundreds of agency owners and the #1 reason they're stuck at the same revenue for years comes down to one thing.\n\n[CORE CONTENT - 45 sec]\nThey're the system. Everything runs through them.\n\nEvery decision. Every follow-up. Every new client onboarding.\n\nAnd here's what that really means: your business has a ceiling, and that ceiling is your personal capacity.\n\nThe fix isn't working harder. It's building five core systems:\n1. Lead generation that runs without you\n2. Follow-up that's automated\n3. Client onboarding that's documented\n4. Retention that's proactive\n5. Team accountability that's structured\n\n[CTA - 10 sec]\nWhich of these five systems is weakest in your business right now? Comment below and I'll give you the first step to fix it.",
  },
  reel_script: {
    title: "3 Signs You Need Systems",
    outputText: "[HOOK - 3 sec]\n\"3 signs your business needs better systems\" (text on screen)\n\n[POINT 1 - 5 sec]\nYou answer the same question from your team more than twice a week.\n(Show frustrated face, then writing SOP)\n\n[POINT 2 - 5 sec]\nYour revenue goes down when you take a day off.\n(Show vacation anxiety, then relaxed with phone off)\n\n[POINT 3 - 5 sec]\nYou can't hire because \"nobody does it like you.\"\n(Show overwhelmed solo, then team running smoothly)\n\n[CTA - 3 sec]\nFix all three with one thing: documented processes.\nFollow for more operational wins.",
  },
  green_screen_script: {
    title: "The Value Equation Breakdown",
    outputText: JSON.stringify({
      openingHook: "Here's why 90% of businesses compete on price - and exactly how to stop.",
      onScreenAsset: "Show the Value Equation: (Dream Outcome x Likelihood) / (Time x Effort) = VALUE",
      beats: [
        { script: "Most businesses are stuck in a price war because their offer is a commodity. Same thing, different logo.", sceneNote: "Speaker on camera, no graphic yet", gesture: "Shake head, palms out", bRoll: "Competitor logos side by side" },
        { script: "But there's a formula that changes everything. Look at this.", sceneNote: "Bring up Value Equation graphic", gesture: "Point to screen behind you", bRoll: "Equation animates in" },
        { script: "Dream Outcome: What does your customer ACTUALLY want? Not your product - the RESULT.", sceneNote: "Highlight 'Dream Outcome'", gesture: "Count on fingers - one", bRoll: "Before/after transformation" },
        { script: "Perceived Likelihood: Do they believe it'll work for THEM specifically?", sceneNote: "Highlight 'Likelihood'", gesture: "Count - two, point at camera", bRoll: "Testimonial screenshots" },
        { script: "Now the bottom - Time Delay. How fast do they see results? And Effort - how easy is it?", sceneNote: "Highlight bottom of equation", gesture: "Push down motion with both hands", bRoll: "Clock + easy button" },
        { script: "Maximize the top. Minimize the bottom. That's how you make price irrelevant.", sceneNote: "Full equation visible, arrows showing direction", gesture: "Big gesture - pulling up top, pushing down bottom", bRoll: "Price tag with X through it" },
      ],
      cta: "Save this and use it to audit your offer this week. Comment 'OFFER' if you want the full breakdown doc.",
      shortVersion: "Your offer competes on price because the value equation is off. Maximize dream outcome and likelihood, minimize time and effort. That's how you make price irrelevant.",
      expandedVersion: "Extended version includes real case studies from three different industries showing the value equation in action, plus a step-by-step audit checklist for your current offer.",
    }),
  },
  workshop_lesson: {
    title: "Workshop: Building Your First Business System",
    outputText: "WORKSHOP LESSON: Building Your First Business System\n\nDuration: 45 minutes\n\nLearning Objective: Participants will document one complete business system they can delegate by end of session.\n\nOpening (5 min):\n- Ask: \"What's one thing in your business that only YOU can do?\" (Write answers on board)\n- Reveal: Most of those things can be systemized.\n\nCore Teaching (20 min):\n1. The SOP Framework:\n   - Trigger: What starts this process?\n   - Steps: What happens, in order?\n   - Decision Points: Where does someone need to choose?\n   - Output: What's the deliverable?\n   - Quality Check: How do you know it's done right?\n\n2. Live Demo: Document a real process in real-time\n\n3. Common Mistakes:\n   - Too detailed (nobody reads a 50-step SOP)\n   - Too vague (\"handle the client\" isn't a step)\n   - No owner (who's responsible?)\n\nWorkshop Activity (15 min):\n- Each person picks ONE process\n- Uses the SOP Framework to document it\n- Pair share and stress-test with partner\n\nClose (5 min):\n- Homework: Have someone else run this process using only your SOP this week\n- Report back on what broke",
  },
  blog_outline: {
    title: "Blog: The 5 Systems Every Agency Needs",
    outputText: "BLOG OUTLINE: The 5 Systems Every Agency Needs to Scale Past $500K\n\nTarget: 1,500-2,000 words\nAudience: Insurance agency owners doing $200K-$500K\n\nI. Hook/Intro\n- The ceiling every agency hits\n- Why working harder won't break through\n- Promise: 5 systems that changed everything for my clients\n\nII. System 1: Lead Generation Engine\n- Why most agencies rely on referrals alone\n- Building a predictable pipeline\n- One quick implementation step\n\nIII. System 2: Follow-Up Automation\n- The fortune is in the follow-up (with data)\n- Automated vs. personal touch balance\n- Tool recommendations\n\nIV. System 3: Client Onboarding\n- First 48 hours set the tone\n- Checklist approach\n- How this reduces churn\n\nV. System 4: Retention Workflows\n- Proactive vs. reactive retention\n- Annual review automation\n- Cross-sell/upsell triggers\n\nVI. System 5: Team Accountability\n- Scorecards that work\n- Weekly rhythm\n- How to hold people accountable without micromanaging\n\nVII. Conclusion\n- The compound effect of all five\n- Start with one, master it, move to next\n- CTA: Download the systems checklist",
  },
  talking_points: {
    title: "Talking Points: Systems Over Hustle",
    outputText: "TALKING POINTS: Systems Over Hustle\n\n- The businesses that scale fastest aren't the ones with the hardest workers - they're the ones with the best systems\n- A system is just a documented, repeatable way to get a result\n- Most business owners are the system - and that's the ceiling\n- Five core systems every business needs: lead gen, follow-up, onboarding, retention, accountability\n- Start with the thing you do most often and hate doing\n- You don't need perfect systems - you need STARTED systems\n- A bad SOP that exists beats a perfect one that doesn't\n- The ROI on documentation: do the math on time saved x hourly rate x 52 weeks\n- Objection handling: \"But my business is different\" - no, your ego is different\n- Action step: This week, record yourself doing one task start to finish, then transcribe it - that's your first SOP",
  },
  book_note: {
    title: "Book Notes: The E-Myth Revisited Principles",
    outputText: "BOOK NOTES\n\nCore Thesis: Most business owners are technicians who had an entrepreneurial seizure. They started a business doing what they know, but never learned to build the BUSINESS itself.\n\nKey Concepts:\n1. Three personalities: Entrepreneur (visionary), Manager (planner), Technician (doer)\n2. Most owners are 70% technician, 20% manager, 10% entrepreneur\n3. The franchise model is the key: build it as if you'll franchise it\n4. Work ON the business, not IN the business\n\nHow This Connects to My Work:\n- Directly supports the systems-over-hustle framework\n- The \"franchise prototype\" concept = my SOP approach\n- Agency owners are classic technicians (great at insurance, bad at business)\n\nQuotes to Reference:\n- \"If your business depends on you, you don't own a business - you have a job\"\n\nContent Ideas from This:\n- Contrast technician vs entrepreneur in agency context\n- \"Are you building an agency or just doing insurance?\"\n- The franchise test: could someone run your agency with a manual?",
  },
  carousel_outline: {
    title: "Carousel: 5 Agency Systems",
    outputText: "CAROUSEL OUTLINE: 5 Systems Every Agency Needs\n\nSlide 1 (Cover):\n\"5 Systems That Took My Clients from Stuck to Scaling\"\nSubtext: Which one are you missing?\n\nSlide 2:\nSystem #1: Lead Generation Engine\n\"Stop relying on referrals alone. Build a pipeline that works while you sleep.\"\nVisual: Funnel graphic\n\nSlide 3:\nSystem #2: Follow-Up Automation\n\"80% of sales happen after the 5th follow-up. Are you even making it to 3?\"\nVisual: Follow-up sequence diagram\n\nSlide 4:\nSystem #3: Client Onboarding\n\"The first 48 hours set the tone for the entire relationship.\"\nVisual: Checklist graphic\n\nSlide 5:\nSystem #4: Retention Workflows\n\"It costs 5x more to find a new client than keep one. Act like it.\"\nVisual: Retention cycle\n\nSlide 6:\nSystem #5: Team Accountability\n\"A team without scorecards is a team without direction.\"\nVisual: Scorecard preview\n\nSlide 7 (CTA):\n\"Which system are you building first? Comment below.\"\n\"Save this for when you're ready to scale.\"",
  },
};

export async function generateContent(input: GenerationInput): Promise<GenerationResult> {
  if (isMockMode()) {
    const mockResult = MOCK_OUTPUTS[input.outputType] || MOCK_OUTPUTS.content_idea;
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 500));
    return { ...mockResult };
  }

  const systemPrompt = `You are a content generation expert. Generate high-quality ${input.outputType.replace(/_/g, " ")} content.${input.creatorStyle ? ` Style reference: ${input.creatorStyle}` : ""}${input.meshWithMethodology && input.methodologySettings ? ` Methodology: ${JSON.stringify(input.methodologySettings)}` : ""}`;
  const userPrompt = `Generate a ${input.outputType.replace(/_/g, " ")} based on this source material:\n\n${input.sourceTexts.join("\n\n")}\n\nAudience: ${input.audience || "general"}\nContent mode: ${input.contentMode || "educational"}\nTone: ${input.toneNotes || "professional"}`;

  const text = await chatCompletion(systemPrompt, userPrompt, {
    temperature: input.originalityLevel === "high" ? 0.9 : input.originalityLevel === "low" ? 0.5 : 0.7,
  });

  const titleMatch = text.match(/^(?:TITLE:|#)\s*(.+)/m);

  return {
    title: titleMatch?.[1] || `Generated ${input.outputType}`,
    outputText: text,
  };
}

export async function generateDailyIdeas(settings?: Record<string, unknown>): Promise<{
  contentIdeas: string[];
  videoIdeas: string[];
  teachingIdeas: string[];
  contrarianTake: string;
}> {
  if (isMockMode()) {
    return {
      contentIdeas: [
        "Why most business owners confuse being busy with being productive - and the one question that fixes it",
        "The 3-minute morning routine I use to set my brain for high performance (not meditation)",
        "Stop asking 'how do I get more clients?' - start asking 'how do I keep the ones I have?'",
        "The hidden cost of not having a follow-up system (I calculated mine - it was $47K/year)",
        "What poker taught me about business decisions under pressure",
      ],
      videoIdeas: [
        "Green screen breakdown: The anatomy of a viral business post (dissecting 3 examples)",
        "Talking head: 'Your business has a ceiling and it's YOU' - the uncomfortable truth about scaling",
        "Reel: 3 signs you're a technician pretending to be a CEO (under 30 seconds)",
      ],
      teachingIdeas: [
        "Workshop module: Building your first automated follow-up sequence in 60 minutes",
        "Deep dive: The psychology of why people don't buy - and how to remove every friction point",
      ],
      contrarianTake: "Unpopular opinion: Coaching certifications are holding the industry back. The best coaches I know have zero certifications and massive results. Here's why credentials are the new comfort zone.",
    };
  }

  const text = await chatCompletion(
    "Generate daily content ideas for a business coach and content creator. Return JSON with: contentIdeas (5 strings), videoIdeas (3 strings), teachingIdeas (2 strings), contrarianTake (1 string).",
    `Generate today's content ideas. Settings: ${JSON.stringify(settings || {})}`,
    { temperature: 0.9, jsonMode: true }
  );

  return JSON.parse(text || "{}");
}

// Export for use by openai-client mock path
export function mockGenerateOutput(outputType: string): string {
  const mockResult = MOCK_OUTPUTS[outputType] || MOCK_OUTPUTS.content_idea;
  return mockResult.outputText;
}

export async function generateOutputReal(params: {
  sourceContent: string;
  outputType: string;
  contentMode?: string;
  audience?: string;
  originalityLevel?: string;
  toneNotes?: string;
  meshWithMethodology?: boolean;
}): Promise<string> {
  const result = await generateContent({
    sourceTexts: [params.sourceContent],
    outputType: params.outputType,
    contentMode: params.contentMode,
    audience: params.audience,
    originalityLevel: params.originalityLevel,
    toneNotes: params.toneNotes,
    meshWithMethodology: params.meshWithMethodology,
  });
  return result.outputText;
}
