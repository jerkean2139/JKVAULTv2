"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Target,
  Flame,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TREND_AREAS } from "@/lib/utils/constants";

const TREND_ICONS: Record<string, string> = {
  coaching: "bg-emerald-500/20 text-emerald-400",
  mindset: "bg-purple-500/20 text-purple-400",
  marketing: "bg-blue-500/20 text-blue-400",
  systems: "bg-amber-500/20 text-amber-400",
  processes: "bg-teal-500/20 text-teal-400",
  leadership: "bg-rose-500/20 text-rose-400",
  ai: "bg-indigo-500/20 text-indigo-400",
};

interface TrendData {
  area: string;
  risingTopics: { topic: string; score: number }[];
  topHeadlines: string[];
  overusedWarnings: string[];
  opportunityScore: number;
}

const MOCK_TRENDS: TrendData[] = [
  {
    area: "coaching",
    risingTopics: [
      { topic: "Hybrid coaching models", score: 89 },
      { topic: "AI-augmented coaching", score: 85 },
      { topic: "Group coaching scalability", score: 76 },
    ],
    topHeadlines: [
      "Why 1:1 coaching is dying (and what replaces it)",
      "The 3-tier coaching model that scales to $1M",
      "How AI is transforming the coaching industry",
    ],
    overusedWarnings: ["Imposter syndrome content", "Morning routines"],
    opportunityScore: 82,
  },
  {
    area: "mindset",
    risingTopics: [
      { topic: "Identity-level change", score: 91 },
      { topic: "Nervous system regulation for entrepreneurs", score: 84 },
      { topic: "Anti-hustle productivity", score: 78 },
    ],
    topHeadlines: [
      "The identity shift that unlocked my 7-figure year",
      "Why mindset without systems is just meditation",
      "Nervous system work: the missing piece in your growth",
    ],
    overusedWarnings: ["Gratitude journaling posts", "5 AM wake-up content"],
    opportunityScore: 75,
  },
  {
    area: "marketing",
    risingTopics: [
      { topic: "Community-led growth", score: 94 },
      { topic: "Founder-brand positioning", score: 88 },
      { topic: "AI content personalization", score: 83 },
    ],
    topHeadlines: [
      "Paid communities are the new email lists",
      "Why your personal brand IS your marketing strategy in 2026",
      "The death of generic content and the rise of hyper-personalization",
    ],
    overusedWarnings: ["Content pillars frameworks", "Hook-heavy posts with no substance"],
    opportunityScore: 91,
  },
  {
    area: "systems",
    risingTopics: [
      { topic: "AI agent workflows", score: 96 },
      { topic: "No-code automation stacks", score: 87 },
      { topic: "SOPs as a product", score: 74 },
    ],
    topHeadlines: [
      "I replaced my VA with AI agents - here's what happened",
      "The automation stack that runs my business in 4 hours/week",
      "Selling your SOPs: the unexpected revenue stream",
    ],
    overusedWarnings: ["Generic productivity hacks", "Tool comparison posts"],
    opportunityScore: 88,
  },
  {
    area: "processes",
    risingTopics: [
      { topic: "Async-first workflows", score: 82 },
      { topic: "Decision frameworks", score: 79 },
      { topic: "Process documentation as content", score: 71 },
    ],
    topHeadlines: [
      "The meeting-free organization: how we did it",
      "One decision framework that eliminated analysis paralysis",
      "Document everything: the process that built a $5M agency",
    ],
    overusedWarnings: ["Notion template posts", "Generic time management"],
    opportunityScore: 68,
  },
  {
    area: "leadership",
    risingTopics: [
      { topic: "Radical candor in remote teams", score: 86 },
      { topic: "Founder succession planning", score: 77 },
      { topic: "Culture as competitive advantage", score: 83 },
    ],
    topHeadlines: [
      "Why your A-players are leaving (it's not money)",
      "The leadership style shift that doubled retention",
      "Building culture in a fully remote company",
    ],
    overusedWarnings: ["Leadership quotes without context", "Toxic positivity"],
    opportunityScore: 73,
  },
  {
    area: "ai",
    risingTopics: [
      { topic: "AI agents for small business", score: 97 },
      { topic: "Custom GPTs for client delivery", score: 92 },
      { topic: "AI-generated video content", score: 88 },
    ],
    topHeadlines: [
      "Why every solopreneur needs an AI agent in 2026",
      "Custom GPTs: the productized service multiplier",
      "I generated a month of content in 2 hours with AI",
    ],
    overusedWarnings: ["AI will replace you fear posts", "Basic ChatGPT prompt lists"],
    opportunityScore: 95,
  },
];

export default function TrendsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [trends] = useState(MOCK_TRENDS);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/trends/refresh", { method: "POST" });
    } catch {
      // API not ready
    }
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Trends" description="Real-time trend intelligence across your content areas">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh Trends
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trends
          .sort((a, b) => b.opportunityScore - a.opportunityScore)
          .slice(0, 4)
          .map((trend) => (
            <Card key={trend.area} className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${TREND_ICONS[trend.area]}`}>
                  {trend.area}
                </span>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-indigo-400" />
                  <span className="text-lg font-bold text-indigo-400">
                    {trend.opportunityScore}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Opportunity Score</p>
            </Card>
          ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {trends.map((trend) => (
          <Card
            key={trend.area}
            className="border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${TREND_ICONS[trend.area]}`}>
                  {trend.area}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-400">
                  {trend.opportunityScore}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Rising Topics</span>
                  </div>
                  <div className="space-y-2">
                    {trend.risingTopics.map((topic) => (
                      <div key={topic.topic} className="flex items-center justify-between">
                        <span className="text-sm">{topic.topic}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                              style={{ width: `${topic.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-emerald-400 w-6 text-right">
                            {topic.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">Top Headlines</span>
                  </div>
                  <div className="space-y-1.5">
                    {trend.topHeadlines.map((headline, i) => (
                      <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                        &bull; {headline}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-xs font-medium text-red-400">Overused - Avoid</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trend.overusedWarnings.map((warning) => (
                      <span
                        key={warning}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        {warning}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
