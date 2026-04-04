import { isMockMode } from "@/lib/utils/mock-mode";
import prisma from "@/lib/db";

export interface TrendItem {
  topicArea: string;
  headline: string;
  summary: string;
  sourceUrl?: string;
  source: string;
  score: number;
  isRising: boolean;
  isOverused: boolean;
}

const MOCK_TRENDS: TrendItem[] = [
  { topicArea: "ai", headline: "AI Agents Replacing Traditional SaaS", summary: "AI agents that autonomously complete complex business tasks are reshaping the software landscape.", source: "tech-trends", score: 94, isRising: true, isOverused: false },
  { topicArea: "ai", headline: "Vibe Coding Changes Developer Workflows", summary: "AI-assisted development where natural language drives code generation is becoming mainstream.", source: "tech-trends", score: 88, isRising: true, isOverused: false },
  { topicArea: "ai", headline: "RAG Fatigue Setting In", summary: "Many RAG implementations underperform. Market shifting to agentic approaches instead.", source: "industry", score: 62, isRising: false, isOverused: true },
  { topicArea: "coaching", headline: "Micro-Coaching Subscriptions Growing", summary: "Coaches offering low-ticket monthly subscriptions for async coaching are gaining traction.", source: "coaching-industry", score: 81, isRising: true, isOverused: false },
  { topicArea: "coaching", headline: "AI-Powered Coaching Assistants", summary: "Coaches using AI to supplement client interactions between live sessions.", source: "coaching-industry", score: 77, isRising: true, isOverused: false },
  { topicArea: "coaching", headline: "'Just Believe' Content Losing Trust", summary: "Audiences increasingly skeptical of mindset-only coaching without tactical substance.", source: "coaching-industry", score: 55, isRising: false, isOverused: true },
  { topicArea: "marketing", headline: "Long-Form Content Comeback", summary: "Audiences showing preference for deeper content over endless short clips.", source: "marketing-data", score: 85, isRising: true, isOverused: false },
  { topicArea: "marketing", headline: "DM-Based Selling at Scale", summary: "Automated DM funnels on Instagram and Facebook driving significant revenue for creators.", source: "marketing-data", score: 79, isRising: true, isOverused: false },
  { topicArea: "marketing", headline: "Engagement Bait Algorithms Penalized", summary: "Platforms cracking down on low-quality engagement bait posts.", source: "marketing-data", score: 67, isRising: false, isOverused: true },
  { topicArea: "leadership", headline: "Asynchronous Leadership Models", summary: "Leaders managing global remote teams through async communication and documented decisions.", source: "leadership-analysis", score: 73, isRising: true, isOverused: false },
  { topicArea: "leadership", headline: "Radical Transparency Backlash", summary: "Some teams pushing back on 'radical transparency' as performative.", source: "leadership-analysis", score: 58, isRising: false, isOverused: true },
  { topicArea: "systems", headline: "AI-Powered Workflow Automation", summary: "AI tools that build and optimize business workflows autonomously.", source: "tech-trends", score: 91, isRising: true, isOverused: false },
  { topicArea: "systems", headline: "Second Brain for Teams", summary: "Team knowledge management systems replacing individual note-taking apps.", source: "tech-trends", score: 74, isRising: true, isOverused: false },
  { topicArea: "mindset", headline: "Nervous System Regulation for Executives", summary: "Somatic practices adopted by business leaders for better decision-making.", source: "wellness-business", score: 76, isRising: true, isOverused: false },
  { topicArea: "mindset", headline: "Anti-Hustle Productivity", summary: "Focus on sustainable energy management over grinding culture.", source: "wellness-business", score: 82, isRising: true, isOverused: false },
  { topicArea: "processes", headline: "SOPs as Competitive Advantage", summary: "Well-documented processes enabling faster scaling and better team performance.", source: "operations", score: 78, isRising: true, isOverused: false },
  { topicArea: "processes", headline: "Process Mining Tools for SMBs", summary: "Tools that auto-discover and map business processes becoming accessible to smaller companies.", source: "operations", score: 69, isRising: true, isOverused: false },
];

export async function fetchTrends(): Promise<TrendItem[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_TRENDS;
  }

  // In real mode, could use RSS feeds, News API, etc.
  // For now, return stored trends from DB with potential refresh
  try {
    if (process.env.NEWS_API_KEY) {
      // Would integrate with News API here
    }
  } catch {
    // Fall back to mock
  }

  return MOCK_TRENDS;
}

export async function refreshAndStoreTrends(): Promise<number> {
  const trends = await fetchTrends();

  // Clear old trends and insert fresh ones
  await prisma.trendTopic.deleteMany({});
  await prisma.trendTopic.createMany({
    data: trends.map((t) => ({
      topicArea: t.topicArea,
      headline: t.headline,
      summary: t.summary,
      sourceUrl: t.sourceUrl,
      source: t.source,
      score: t.score,
      isRising: t.isRising,
      isOverused: t.isOverused,
    })),
  });

  return trends.length;
}
