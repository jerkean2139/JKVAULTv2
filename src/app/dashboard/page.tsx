"use client";

import { useState, useEffect } from "react";
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

interface DashboardData {
  totalContent: number;
  generatedOutputs: number;
  creatorsTracked: number;
  pendingReview: number;
  recentItems: { id: string; title: string; sourceType: string; creatorNameRaw?: string; savedCreator?: { name: string }; status: string; createdAt: string }[];
  categories: { name: string; count: number }[];
  trends: { headline: string; isRising: boolean; score: number }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalContent: 0,
    generatedOutputs: 0,
    creatorsTracked: 0,
    pendingReview: 0,
    recentItems: [],
    categories: [],
    trends: [],
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [contentRes, outputsRes, creatorsRes, categoriesRes, trendsRes] = await Promise.allSettled([
          fetch("/api/content?limit=5&sort=newest"),
          fetch("/api/generate?limit=1"),
          fetch("/api/creators"),
          fetch("/api/categories"),
          fetch("/api/trends"),
        ]);

        const contentData = contentRes.status === "fulfilled" && contentRes.value.ok ? await contentRes.value.json() : { items: [], total: 0 };
        const outputsData = outputsRes.status === "fulfilled" && outputsRes.value.ok ? await outputsRes.value.json() : { total: 0 };
        const creatorsData = creatorsRes.status === "fulfilled" && creatorsRes.value.ok ? await creatorsRes.value.json() : [];
        const categoriesData = categoriesRes.status === "fulfilled" && categoriesRes.value.ok ? await categoriesRes.value.json() : [];
        const trendsData = trendsRes.status === "fulfilled" && trendsRes.value.ok ? await trendsRes.value.json() : [];

        const pendingCount = (contentData.items || []).filter((i: { status: string }) => i.status === "draft").length;

        setData({
          totalContent: contentData.total || 0,
          generatedOutputs: outputsData.total || 0,
          creatorsTracked: Array.isArray(creatorsData) ? creatorsData.length : 0,
          pendingReview: pendingCount,
          recentItems: (contentData.items || []).slice(0, 5),
          categories: Array.isArray(categoriesData)
            ? categoriesData
                .filter((c: { _count?: { contentItemCategories: number } }) => (c._count?.contentItemCategories || 0) > 0)
                .map((c: { name: string; _count?: { contentItemCategories: number } }) => ({ name: c.name, count: c._count?.contentItemCategories || 0 }))
                .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
                .slice(0, 6)
            : [],
          trends: Array.isArray(trendsData)
            ? trendsData.slice(0, 4).map((t: { headline: string; isRising: boolean; score: number }) => ({
                headline: t.headline,
                isRising: t.isRising,
                score: t.score || 0,
              }))
            : [],
        });
      } catch {
        // API unavailable, keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Your content intelligence overview" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-64 rounded-xl bg-card/50 animate-pulse" />
          <div className="h-64 rounded-xl bg-card/50 animate-pulse" />
        </div>
      </div>
    );
  }

  const maxCatCount = Math.max(...data.categories.map((c) => c.count), 1);

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
        <StatCard title="Total Content" value={data.totalContent} icon={FileText} subtitle="Across all sources" />
        <StatCard title="Generated Outputs" value={data.generatedOutputs} icon={Sparkles} subtitle="Posts, scripts, ideas" />
        <StatCard title="Creators Tracked" value={data.creatorsTracked} icon={Users} subtitle={`${data.creatorsTracked} of 20 slots used`} />
        <StatCard title="Pending Review" value={data.pendingReview} icon={Clock} subtitle="Draft items" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Content</CardTitle>
            <Link href="/library">
              <Button variant="ghost" size="sm">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No content yet. Add your first piece of content to get started.</p>
                <Link href="/inbox">
                  <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white" size="sm">
                    <Plus className="h-3 w-3 mr-1" /> Add Content
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentItems.map((item) => (
                  <Link key={item.id} href={`/library/${item.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate group-hover:text-indigo-400 transition-colors">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.savedCreator?.name || item.creatorNameRaw || "You"} &middot; {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${SOURCE_BADGES[item.sourceType] || SOURCE_BADGES.other}`}>
                        {item.sourceType.replace(/_/g, " ")}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[item.status] || STATUS_BADGES.draft}`}>
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" /> Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.categories.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Categories will appear as you add content.</p>
              ) : (
                <div className="space-y-3">
                  {data.categories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="text-sm">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${(cat.count / maxCatCount) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/inbox"><Button variant="outline" size="sm" className="w-full justify-start"><Plus className="mr-1 h-3 w-3" /> Add Content</Button></Link>
                <Link href="/generate"><Button variant="outline" size="sm" className="w-full justify-start"><Sparkles className="mr-1 h-3 w-3" /> Generate</Button></Link>
                <Link href="/ideas/daily"><Button variant="outline" size="sm" className="w-full justify-start"><Zap className="mr-1 h-3 w-3" /> Daily Ideas</Button></Link>
                <Link href="/trends"><Button variant="outline" size="sm" className="w-full justify-start"><TrendingUp className="mr-1 h-3 w-3" /> Trends</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {data.trends.length > 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Trends Snapshot
            </CardTitle>
            <Link href="/trends"><Button variant="ghost" size="sm">View all <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.trends.map((trend, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{trend.headline}</p>
                    <p className={`text-xs font-medium ${trend.isRising ? "text-emerald-400" : "text-red-400"}`}>
                      {trend.isRising ? "Rising" : "Declining"}
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
      )}
    </div>
  );
}
