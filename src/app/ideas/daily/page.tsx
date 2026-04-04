"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  RefreshCw,
  Lightbulb,
  Video,
  GraduationCap,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  Sparkles,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_CONTENT_IDEAS = [
  {
    id: "d1",
    text: "The 'Invisible Tax' killing your agency - why custom work costs you more than you think, and the simple shift to productized services that doubled my margins",
  },
  {
    id: "d2",
    text: "I asked 50 State Farm agents their #1 struggle. The answer wasn't leads - it was this...",
  },
  {
    id: "d3",
    text: "The 3-email sequence that turns cold leads into booked calls (steal this template)",
  },
  {
    id: "d4",
    text: "Why your 'free value' content is actually hurting your sales - and what to do instead",
  },
  {
    id: "d5",
    text: "The Monday Morning System: how I plan an entire week of content in 37 minutes",
  },
];

const MOCK_VIDEO_IDEAS = [
  {
    id: "v1",
    text: "TALKING HEAD: 'The $100M framework nobody's using' - Break down Hormozi's value equation with real examples from your coaching clients. Show the before/after math.",
    format: "Talking Head",
  },
  {
    id: "v2",
    text: "GREEN SCREEN: 'I analyzed 100 top-performing posts' - Screen share analysis of viral content patterns in the coaching/biz space. Reveal the 3 formats that get 10x engagement.",
    format: "Green Screen",
  },
  {
    id: "v3",
    text: "REEL: 'POV: You just realized your offer is a commodity' - Quick hook, problem, framework reveal, CTA. Under 60 seconds. Punchy transitions.",
    format: "Reel",
  },
];

const MOCK_TEACHING_IDEAS = [
  {
    id: "t1",
    text: "Workshop Lesson: 'Building Your First Automated Funnel' - Walk through setting up a 3-step funnel from scratch. Include: landing page template, email sequence, and follow-up automation. Give them the exact tools and step-by-step.",
  },
  {
    id: "t2",
    text: "Framework Teach: 'The IMPACT Method for Content That Converts' - Identify pain, Map solutions, Present framework, Apply to their business, Create action plan, Track results. Build this into a reusable teaching module.",
  },
];

const MOCK_CONTRARIAN = {
  id: "c1",
  text: "CONTRARIAN TAKE: 'Stop creating content. Start creating systems.' Everyone says 'just post more.' That's the worst advice in 2026. The creators winning right now aren't posting more - they're building content SYSTEMS that produce 10x output from 1x effort. Posting more without a system is just organized chaos with better lighting.",
};

interface DailyIdeasData {
  contentIdeas: { id: string; text: string }[];
  videoIdeas: { id: string; text: string; format?: string }[];
  teachingIdeas: { id: string; text: string }[];
  contrarianTake: { id: string; text: string };
}

export default function DailyIdeasPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [data, setData] = useState<DailyIdeasData>({
    contentIdeas: MOCK_CONTENT_IDEAS,
    videoIdeas: MOCK_VIDEO_IDEAS,
    teachingIdeas: MOCK_TEACHING_IDEAS,
    contrarianTake: MOCK_CONTRARIAN,
  });

  const fetchDaily = async () => {
    try {
      const res = await fetch("/api/ideas/daily");
      if (!res.ok) throw new Error("Failed to fetch daily ideas");
      const apiData = await res.json();

      const contentIdeas = (apiData.contentIdeas || []).map((text: string, i: number) => ({
        id: `d${i + 1}`,
        text,
      }));
      const videoIdeas = (apiData.videoIdeas || []).map((text: string, i: number) => {
        let format: string | undefined;
        if (text.toUpperCase().startsWith("TALKING HEAD")) format = "Talking Head";
        else if (text.toUpperCase().startsWith("GREEN SCREEN")) format = "Green Screen";
        else if (text.toUpperCase().startsWith("REEL")) format = "Reel";
        return { id: `v${i + 1}`, text, format };
      });
      const teachingIdeas = (apiData.teachingIdeas || []).map((text: string, i: number) => ({
        id: `t${i + 1}`,
        text,
      }));
      const contrarianTake = apiData.contrarianTake
        ? { id: "c1", text: apiData.contrarianTake }
        : MOCK_CONTRARIAN;

      if (contentIdeas.length > 0 || videoIdeas.length > 0 || teachingIdeas.length > 0) {
        setData({
          contentIdeas: contentIdeas.length > 0 ? contentIdeas : MOCK_CONTENT_IDEAS,
          videoIdeas: videoIdeas.length > 0 ? videoIdeas : MOCK_VIDEO_IDEAS,
          teachingIdeas: teachingIdeas.length > 0 ? teachingIdeas : MOCK_TEACHING_IDEAS,
          contrarianTake,
        });
      }
    } catch {
      // Keep mock data as fallback
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchDaily();
      setLoading(false);
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDaily();
    } catch {
      // Keep existing data
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const IdeaCard = ({
    id,
    text,
    extra,
  }: {
    id: string;
    text: string;
    extra?: string;
  }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group">
      <div className="flex-1 min-w-0">
        {extra && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 mb-2 inline-block">
            {extra}
          </span>
        )}
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleCopy(text, id)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {copied === id ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
        <Link href={`/generate?ideaText=${encodeURIComponent(text)}`}>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="p-4 rounded-lg bg-muted/20 animate-pulse">
      <div className="h-3 w-full rounded bg-muted/30 mb-2" />
      <div className="h-3 w-3/4 rounded bg-muted/30" />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Daily Ideas" description="Fresh content ideas generated just for you today">
        <div className="flex items-center gap-2">
          <Link href="/ideas">
            <Button variant="outline" size="sm">
              All Ideas
            </Button>
          </Link>
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
            Refresh Ideas
          </Button>
        </div>
      </PageHeader>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                5 Content Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-red-400" />
                3 Video Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                2 Teaching Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2 animate-pulse">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                1 Contrarian Take
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
                <div className="h-3 w-full rounded bg-muted/30 mb-2" />
                <div className="h-3 w-full rounded bg-muted/30 mb-2" />
                <div className="h-3 w-2/3 rounded bg-muted/30" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                {data.contentIdeas.length} Content Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.contentIdeas.map((idea) => (
                  <IdeaCard key={idea.id} id={idea.id} text={idea.text} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-red-400" />
                {data.videoIdeas.length} Video Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.videoIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    id={idea.id}
                    text={idea.text}
                    extra={idea.format}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                {data.teachingIdeas.length} Teaching Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.teachingIdeas.map((idea) => (
                  <IdeaCard key={idea.id} id={idea.id} text={idea.text} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                1 Contrarian Take
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed font-medium">
                      {data.contrarianTake.text}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(data.contrarianTake.text, data.contrarianTake.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      {copied === data.contrarianTake.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <Link
                      href={`/generate?ideaText=${encodeURIComponent(data.contrarianTake.text)}`}
                    >
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
