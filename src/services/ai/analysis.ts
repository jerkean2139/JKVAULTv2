import {
  CONTENT_ANALYSIS_SYSTEM_PROMPT,
  CONTENT_ANALYSIS_USER_PROMPT,
} from "@/prompts/analysis";
import { chatCompletion } from "@/services/ai/openai-client";
import { isMockMode } from "@/lib/utils/mock-mode";

export interface AnalysisResult {
  shortSummary: string;
  detailedSummary: string;
  hookAnalysis: {
    openingHook: string;
    hookType: string;
    effectiveness: string;
    notes: string;
  };
  persuasionAngle: string;
  usefulVsFluff: {
    usefulPercentage: number;
    fluffPercentage: number;
    keyInsights: string[];
    fluffExamples: string[];
  };
  businessTakeaways: Array<{
    takeaway: string;
    applicableTo: string;
    implementationDifficulty: string;
  }>;
  suggestedCategories: string[];
  suggestedTags: string[];
  suggestedProject: string | null;
  energyStyle: string;
  audienceFit: string;
  categorizationReasoning: string;
}

export async function analyzeContentReal(
  title: string,
  text: string
): Promise<AnalysisResult> {
  const response = await chatCompletion(
    CONTENT_ANALYSIS_SYSTEM_PROMPT,
    CONTENT_ANALYSIS_USER_PROMPT(title, text),
    { temperature: 0.4, jsonMode: true }
  );

  return JSON.parse(response) as AnalysisResult;
}

export function mockAnalyzeContent(
  title: string,
  _text: string
): AnalysisResult {
  return {
    shortSummary: `"${title}" explores practical strategies for business growth, focusing on actionable systems that small business owners and agents can implement immediately. The core message centers on building repeatable processes rather than relying on motivation.`,
    detailedSummary: `This content dives deep into the mechanics of sustainable business growth for service-based professionals. The author presents a framework for systematizing client acquisition and retention that doesn't depend on constant hustle or viral moments.

The key thesis is that most small business owners spend 80% of their time on activities that generate less than 20% of their revenue. By implementing three specific systems—automated follow-up sequences, referral trigger events, and weekly accountability metrics—practitioners can reclaim 10+ hours per week while actually increasing output.

The content is particularly relevant for State Farm agents and coaches who struggle with the feast-or-famine cycle. Real case studies are cited, including an agent who went from 15 to 47 policies per month using the outlined approach.`,
    hookAnalysis: {
      openingHook:
        "Opens with a provocative question: 'What if I told you that your hardest-working competitor is actually doing less than you?'",
      hookType: "curiosity_gap",
      effectiveness: "high",
      notes:
        "Effective because it challenges the assumption that more effort equals more results, which resonates with burned-out business owners.",
    },
    persuasionAngle:
      "Authority combined with social proof — uses specific case study numbers and positions the framework as battle-tested rather than theoretical.",
    usefulVsFluff: {
      usefulPercentage: 78,
      fluffPercentage: 22,
      keyInsights: [
        "The 3-system framework for automated client acquisition",
        "Referral trigger events as a specific, implementable tactic",
        "Weekly metrics dashboard approach for accountability",
        "The 80/20 time audit exercise for identifying wasted effort",
      ],
      fluffExamples: [
        "Extended motivational opener about mindset before getting to tactics",
        "Repetitive emphasis on 'you deserve better results' without new information",
      ],
    },
    businessTakeaways: [
      {
        takeaway:
          "Implement a 3-touch automated follow-up sequence for every new lead within 48 hours",
        applicableTo: "State Farm agents, insurance professionals",
        implementationDifficulty: "easy",
      },
      {
        takeaway:
          "Create 'referral trigger events' — specific moments in the client journey where you systematically ask for referrals",
        applicableTo: "All service-based businesses",
        implementationDifficulty: "medium",
      },
      {
        takeaway:
          "Build a weekly 15-minute metrics review using just 4 numbers: leads in, conversations had, proposals sent, deals closed",
        applicableTo: "Small business owners, coaches",
        implementationDifficulty: "easy",
      },
    ],
    suggestedCategories: ["systems", "marketing", "sales"],
    suggestedTags: [
      "lead generation",
      "follow-up systems",
      "referral marketing",
      "business automation",
      "client acquisition",
      "weekly metrics",
    ],
    suggestedProject: "Business Systems Playbook",
    energyStyle: "calm_authority",
    audienceFit:
      "Excellent fit — directly addresses the pain points of State Farm agents and small business owners who want predictable growth without burnout.",
    categorizationReasoning:
      "Categorized under systems and marketing because the content primarily focuses on building repeatable processes (systems) for client acquisition (marketing/sales). The emphasis on automation and metrics makes 'systems' the primary category.",
  };
}

// Unified entry point used by the process API route
export async function analyzeContent(
  text: string,
  title: string
): Promise<{
  shortSummary: string;
  detailedSummary: string;
  hookAnalysis: Record<string, unknown>;
  persuasionAngle: string;
  usefulVsFluff: Record<string, unknown>;
  businessTakeaways: string[];
  suggestedCategories: { name: string; confidence: number }[];
  suggestedTags: string[];
  suggestedProject: string | null;
  energyStyle: string;
  audienceFit: string;
  categorizationReasoning: string;
}> {
  if (isMockMode()) {
    const mock = mockAnalyzeContent(title, text);
    return {
      shortSummary: mock.shortSummary,
      detailedSummary: mock.detailedSummary,
      hookAnalysis: mock.hookAnalysis as unknown as Record<string, unknown>,
      persuasionAngle: mock.persuasionAngle,
      usefulVsFluff: mock.usefulVsFluff as unknown as Record<string, unknown>,
      businessTakeaways: mock.businessTakeaways.map((t) => t.takeaway),
      suggestedCategories: mock.suggestedCategories.map((c, i) => ({
        name: c.charAt(0).toUpperCase() + c.slice(1),
        confidence: 0.9 - i * 0.15,
      })),
      suggestedTags: mock.suggestedTags,
      suggestedProject: mock.suggestedProject,
      energyStyle: mock.energyStyle,
      audienceFit: mock.audienceFit,
      categorizationReasoning: mock.categorizationReasoning,
    };
  }

  const result = await analyzeContentReal(title, text);
  return {
    shortSummary: result.shortSummary,
    detailedSummary: result.detailedSummary,
    hookAnalysis: result.hookAnalysis as unknown as Record<string, unknown>,
    persuasionAngle: result.persuasionAngle,
    usefulVsFluff: result.usefulVsFluff as unknown as Record<string, unknown>,
    businessTakeaways: result.businessTakeaways.map((t) => t.takeaway),
    suggestedCategories: result.suggestedCategories.map((c, i) => ({
      name: c.charAt(0).toUpperCase() + c.slice(1),
      confidence: 0.9 - i * 0.15,
    })),
    suggestedTags: result.suggestedTags,
    suggestedProject: result.suggestedProject,
    energyStyle: result.energyStyle,
    audienceFit: result.audienceFit,
    categorizationReasoning: result.categorizationReasoning,
  };
}
