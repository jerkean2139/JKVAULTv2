"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
  Plus,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_STATS = {
  totalContent: 47,
  generatedOutputs: 132,
  creatorsTracked: 8,
  pendingReview: 5,
};

const MOCK_RECENT = [
  {
    id: "1",
    title: "Alex Hormozi - $100M Offers Framework",
    sourceType: "youtube",
    creator: "Alex Hormozi",
    date: "2026-04-03",
    status: "reviewed",
  },
  {
    id: "2",
    title: "Content Repurposing Masterclass",
    sourceType: "screenshot_set",
    creator: "Justin Welsh",
    date: "2026-04-02",
    status: "draft",
  },
  {
    id: "3",
    title: "The Agency Model is Dead",
    sourceType: "youtube",
    creator: "Iman Gadzhi",
    date: "2026-04-01",
    status: "favorite",
  },
  {
    id: "4",
    title: "How to Build Systems That Scale",
    sourceType: "manual_text",
    creator: "You",
    date: "2026-03-31",
    status: "ready_to_record",
  },
  {
    id: "5",
    title: "Email Sequences That Convert",
    sourceType: "user_content",
    creator: "You",
    date: "2026-03-30",
    status: "draft",
  },
];

const MOCK_CATEGORIES = [
  { name: "Marketing", count: 14 },
  { name: "Mindset", count: 11 },
  { name: "Systems", count: 9 },
  { name: "Leadership", count: 7 },
  { name: "AI & Tech", count: 6 },
];

const MOCK_TRENDS = [
  { topic: "AI Agents for Small Biz", direction: "rising", score: 92 },
  { topic: "Founder-led Sales", direction: "rising", score: 87 },
  { topic: "Hustle Culture", direction: "declining", score: 34 },
  { topic: "Community-led Growth", direction: "rising", score: 78 },
];

const SOURCE_BADGES: Record<string, string> = {
  youtube: "bg-red-500/20 text-red-400",
  youtube_short: "bg-red-500/20 text-red-400",
  screenshot_set: "bg-amber-500/20 text-amber-400",
  manual_text: "bg-blue-500/20 text-blue-400",
  user_content: "bg-indigo-500/20 text-indigo-400",
  other: "bg-zinc-500/20 text-zinc-400",
};

const STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  reviewed: "bg-emerald-500/20 text-emerald-400",
  favorite: "bg-amber-500/20 text-amber-400",
  needs_rewrite: "bg-red-500/20 text-red-400",
  ready_to_record: "bg-indigo-500/20 text-indigo-400",
  archived: "bg-zinc-500/20 text-zinc-400",
};

export default function DashboardPage() {
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Your content intelligence overview" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Your content intelligence overview">
        <Link href="/inbox">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-1" />
            Add Content
          </Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Content"
          value={MOCK_STATS.totalContent}
          icon={FileText}
          trend={{ value: 12, label: "this week" }}
          subtitle="Across all sources"
        />
        <StatCard
          title="Generated Outputs"
          value={MOCK_STATS.generatedOutputs}
          icon={Sparkles}
          trend={{ value: 24, label: "this week" }}
          subtitle="Posts, scripts, ideas"
        />
        <StatCard
          title="Creators Tracked"
          value={MOCK_STATS.creatorsTracked}
          icon={Users}
          subtitle="8 of 20 slots used"
        />
        <StatCard
          title="Pending Review"
          value={MOCK_STATS.pendingReview}
          icon={Clock}
          trend={{ value: -3, label: "from yesterday" }}
          subtitle="Needs your attention"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Content</CardTitle>
            <Link href="/library">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_RECENT.map((item) => (
                <Link
                  key={item.id}
                  href={`/library/${item.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.creator} &middot; {item.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${SOURCE_BADGES[item.sourceType] || SOURCE_BADGES.other}`}
                    >
                      {item.sourceType.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[item.status] || STATUS_BADGES.draft}`}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="text-sm">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${(cat.count / 14) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/inbox">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="mr-1 h-3 w-3" /> Add Content
                  </Button>
                </Link>
                <Link href="/generate">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Sparkles className="mr-1 h-3 w-3" /> Generate
                  </Button>
                </Link>
                <Link href="/ideas/daily">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Zap className="mr-1 h-3 w-3" /> Daily Ideas
                  </Button>
                </Link>
                <Link href="/trends">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="mr-1 h-3 w-3" /> Trends
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Trends Snapshot
          </CardTitle>
          <Link href="/trends">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_TRENDS.map((trend) => (
              <div
                key={trend.topic}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{trend.topic}</p>
                  <p
                    className={`text-xs font-medium ${
                      trend.direction === "rising" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {trend.direction === "rising" ? "Rising" : "Declining"}
                  </p>
                </div>
                <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <span className="text-xs font-bold text-indigo-400">{trend.score}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
