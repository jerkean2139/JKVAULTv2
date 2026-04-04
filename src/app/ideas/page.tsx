"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  OUTPUT_TYPES,
  OUTPUT_TYPE_LABELS,
  AUDIENCES,
  REVIEW_STATUSES,
  REVIEW_STATUS_LABELS,
} from "@/lib/utils/constants";

const TYPE_BADGES: Record<string, string> = {
  content_idea: "bg-indigo-500/20 text-indigo-400",
  facebook_post: "bg-blue-500/20 text-blue-400",
  discussion_post: "bg-sky-500/20 text-sky-400",
  email: "bg-emerald-500/20 text-emerald-400",
  workshop_lesson: "bg-amber-500/20 text-amber-400",
  blog_outline: "bg-purple-500/20 text-purple-400",
  talking_head_script: "bg-red-500/20 text-red-400",
  reel_script: "bg-pink-500/20 text-pink-400",
  green_screen_script: "bg-teal-500/20 text-teal-400",
  talking_points: "bg-orange-500/20 text-orange-400",
  book_note: "bg-zinc-500/20 text-zinc-300",
  carousel_outline: "bg-rose-500/20 text-rose-400",
};

const STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  reviewed: "bg-emerald-500/20 text-emerald-400",
  favorite: "bg-amber-500/20 text-amber-400",
  needs_rewrite: "bg-red-500/20 text-red-400",
  ready_to_record: "bg-indigo-500/20 text-indigo-400",
  archived: "bg-zinc-500/20 text-zinc-400",
};

const MOCK_IDEAS = [
  {
    id: "g1",
    title: "Stop Selling Products, Start Selling Outcomes",
    outputType: "facebook_post",
    preview: "Most businesses compete on price because they sell products. The top 1% compete on value because they sell outcomes. Here's the framework that changed everything...",
    status: "reviewed",
    audience: "Small business owners",
    feedback: null as string | null,
    createdAt: "2026-04-03",
  },
  {
    id: "g2",
    title: "The Value Equation Explainer",
    outputType: "talking_head_script",
    preview: "Today I want to break down the most important equation in business. Most people think value equals price. Wrong. Value equals dream outcome times perceived likelihood divided by time delay times effort...",
    status: "draft",
    audience: "State Farm agents",
    feedback: null as string | null,
    createdAt: "2026-04-03",
  },
  {
    id: "g3",
    title: "5 Systems That Eliminated 20 Hours From My Week",
    outputType: "content_idea",
    preview: "A breakdown of the 5 automation systems I built that freed up 20+ hours per week. Covers: content repurposing, lead nurturing, client onboarding, reporting, and meeting scheduling.",
    status: "favorite",
    audience: "Coaches & consultants",
    feedback: "nailed_it",
    createdAt: "2026-04-02",
  },
  {
    id: "g4",
    title: "The Grand Slam Offer Checklist",
    outputType: "carousel_outline",
    preview: "Slide 1: Your offer doesn't need to be cheaper. It needs to be better. Slide 2: Start with the dream outcome... Slide 3: Map every obstacle...",
    status: "draft",
    audience: "Small business owners",
    feedback: null as string | null,
    createdAt: "2026-04-02",
  },
  {
    id: "g5",
    title: "Why Your Agency Model Is Broken",
    outputType: "reel_script",
    preview: "Hook: 'The agency model is dead and here's the proof.' Beat 1: Custom work doesn't scale. Beat 2: Productized services do. Beat 3: Here's how to switch...",
    status: "ready_to_record",
    audience: "Small business owners",
    feedback: "nailed_it",
    createdAt: "2026-04-01",
  },
  {
    id: "g6",
    title: "Email Welcome Sequence Template",
    outputType: "email",
    preview: "Email 1: Welcome + biggest misconception. Email 2: Quick win delivery. Email 3: Story of transformation. Email 4: Framework teach. Email 5: Soft pitch...",
    status: "reviewed",
    audience: "State Farm agents",
    feedback: null as string | null,
    createdAt: "2026-04-01",
  },
  {
    id: "g7",
    title: "How AI Changed My Content Workflow",
    outputType: "blog_outline",
    preview: "Intro: The before and after. Section 1: Research automation. Section 2: Outline generation. Section 3: Voice matching. Section 4: Repurposing engine...",
    status: "draft",
    audience: "Coaches & consultants",
    feedback: "too_generic",
    createdAt: "2026-03-31",
  },
  {
    id: "g8",
    title: "3 Leadership Mistakes Killing Your Team",
    outputType: "talking_points",
    preview: "Point 1: Micromanaging instead of context-setting. Point 2: Hiring for skill instead of culture. Point 3: Avoiding hard conversations...",
    status: "draft",
    audience: "Advanced operators",
    feedback: null as string | null,
    createdAt: "2026-03-30",
  },
];

export default function IdeasPage() {
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAudience, setFilterAudience] = useState("All");
  const [ideas, setIdeas] = useState(MOCK_IDEAS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await fetch("/api/generate?limit=50");
        if (!res.ok) throw new Error("Failed to fetch ideas");
        const data = await res.json();
        const items = data.items || data;
        if (Array.isArray(items) && items.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = items.map((item: any) => ({
            id: item.id,
            title: item.title || "Untitled",
            outputType: item.outputType || "content_idea",
            preview: (item.outputText || "").slice(0, 200),
            status: item.reviewStatus || "draft",
            audience: item.audience || "",
            feedback: item.feedbackStatus || null,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : "",
          }));
          setIdeas(mapped);
        }
      } catch {
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = useMemo(() => {
    let items = [...ideas];
    if (filterType !== "All") items = items.filter((i) => i.outputType === filterType);
    if (filterStatus !== "All") items = items.filter((i) => i.status === filterStatus);
    if (filterAudience !== "All") items = items.filter((i) => i.audience === filterAudience);
    return items;
  }, [ideas, filterType, filterStatus, filterAudience]);

  const handleFeedback = (id: string, feedback: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, feedback: idea.feedback === feedback ? null : feedback } : idea
      )
    );
  };

  const selectClasses =
    "h-9 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer";

  return (
    <div className="space-y-6">
      <PageHeader title="Ideas" description="All your generated content ideas and outputs">
        <div className="flex items-center gap-2">
          <Link href="/ideas/daily">
            <Button variant="outline" size="sm">
              <Calendar className="h-3 w-3 mr-1" />
              Daily Ideas
            </Button>
          </Link>
          <Link href="/generate">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
              Generate New
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="flex gap-3 flex-wrap">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectClasses}>
          <option value="All">All Types</option>
          {OUTPUT_TYPES.map((t) => (
            <option key={t} value={t}>{OUTPUT_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClasses}>
          <option value="All">All Statuses</option>
          {REVIEW_STATUSES.map((s) => (
            <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={filterAudience} onChange={(e) => setFilterAudience(e.target.value)} className={selectClasses}>
          <option value="All">All Audiences</option>
          {AUDIENCES.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm p-5 h-[200px] animate-pulse flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-16 rounded-full bg-muted/50" />
                <div className="h-5 w-14 rounded-full bg-muted/30" />
              </div>
              <div className="h-4 w-3/4 rounded bg-muted/50 mb-2" />
              <div className="h-3 w-full rounded bg-muted/30 mb-1" />
              <div className="h-3 w-full rounded bg-muted/30 mb-1" />
              <div className="h-3 w-2/3 rounded bg-muted/30 flex-1" />
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20">
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded bg-muted/30" />
                  <div className="h-6 w-6 rounded bg-muted/30" />
                  <div className="h-6 w-6 rounded bg-muted/30" />
                </div>
                <div className="h-3 w-16 rounded bg-muted/30" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredIdeas.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No ideas found"
          description="Adjust your filters or generate new ideas to get started."
          actionLabel="Generate Ideas"
          actionHref="/generate"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-indigo-500/30 transition-all group flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TYPE_BADGES[idea.outputType] || "bg-zinc-500/20 text-zinc-400"}`}>
                  {OUTPUT_TYPE_LABELS[idea.outputType] || idea.outputType}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[idea.status]}`}>
                  {REVIEW_STATUS_LABELS[idea.status]}
                </span>
              </div>
              <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {idea.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-1">
                {idea.preview}
              </p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleFeedback(idea.id, "nailed_it")}
                    className={`p-1.5 rounded-md transition-colors ${idea.feedback === "nailed_it" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback(idea.id, "too_generic")}
                    className={`p-1.5 rounded-md transition-colors ${idea.feedback === "too_generic" ? "bg-amber-500/20 text-amber-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback(idea.id, "not_useful")}
                    className={`p-1.5 rounded-md transition-colors ${idea.feedback === "not_useful" ? "bg-red-500/20 text-red-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{idea.createdAt}</span>
                  <Link href={`/generate/record/${idea.id}`}>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
