"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Library,
  SlidersHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SOURCE_TYPES, REVIEW_STATUSES, REVIEW_STATUS_LABELS } from "@/lib/utils/constants";

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

const MOCK_ITEMS = [
  {
    id: "1",
    title: "Alex Hormozi - $100M Offers Framework",
    sourceType: "youtube",
    creator: "Alex Hormozi",
    summary: "Breaking down the Grand Slam Offer framework: how to create offers so good people feel stupid saying no.",
    status: "reviewed",
    category: "Marketing",
    project: "Offer Design",
    date: "2026-04-03",
  },
  {
    id: "2",
    title: "Content Repurposing Masterclass",
    sourceType: "screenshot_set",
    creator: "Justin Welsh",
    summary: "A systematic approach to turning one piece of content into 12+ assets across platforms.",
    status: "draft",
    category: "Systems",
    project: "Content Engine",
    date: "2026-04-02",
  },
  {
    id: "3",
    title: "The Agency Model is Dead",
    sourceType: "youtube",
    creator: "Iman Gadzhi",
    summary: "Why productized services beat custom agency work and how to transition.",
    status: "favorite",
    category: "Marketing",
    project: "Business Models",
    date: "2026-04-01",
  },
  {
    id: "4",
    title: "How to Build Systems That Scale",
    sourceType: "manual_text",
    creator: "You",
    summary: "My framework for building repeatable systems that remove the founder bottleneck.",
    status: "ready_to_record",
    category: "Systems",
    project: "Scaling Playbook",
    date: "2026-03-31",
  },
  {
    id: "5",
    title: "Email Sequences That Convert",
    sourceType: "user_content",
    creator: "You",
    summary: "My proven 5-email onboarding sequence with open rate benchmarks and templates.",
    status: "draft",
    category: "Marketing",
    project: "Email Mastery",
    date: "2026-03-30",
  },
  {
    id: "6",
    title: "Leadership in Remote Teams",
    sourceType: "youtube",
    creator: "Simon Sinek",
    summary: "Building trust and accountability in distributed teams through intentional leadership practices.",
    status: "reviewed",
    category: "Leadership",
    project: "Team Building",
    date: "2026-03-29",
  },
  {
    id: "7",
    title: "AI Workflows for Solopreneurs",
    sourceType: "manual_text",
    creator: "You",
    summary: "How I use AI to automate 80% of my content creation pipeline.",
    status: "favorite",
    category: "AI & Tech",
    project: "Content Engine",
    date: "2026-03-28",
  },
  {
    id: "8",
    title: "Mindset Shifts for 7-Figure Growth",
    sourceType: "youtube",
    creator: "Ed Mylett",
    summary: "The identity-level changes required to break through income plateaus.",
    status: "draft",
    category: "Mindset",
    project: "Scaling Playbook",
    date: "2026-03-27",
  },
];

const PROJECTS = ["All", "Offer Design", "Content Engine", "Business Models", "Scaling Playbook", "Email Mastery", "Team Building"];
const CATEGORIES = ["All", "Marketing", "Systems", "Leadership", "AI & Tech", "Mindset"];
const CREATORS = ["All", "Alex Hormozi", "Justin Welsh", "Iman Gadzhi", "Simon Sinek", "Ed Mylett", "You"];
const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCreator, setFilterCreator] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let items = [...MOCK_ITEMS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.creator.toLowerCase().includes(q)
      );
    }
    if (filterProject !== "All") items = items.filter((i) => i.project === filterProject);
    if (filterCategory !== "All") items = items.filter((i) => i.category === filterCategory);
    if (filterCreator !== "All") items = items.filter((i) => i.creator === filterCreator);
    if (filterStatus !== "All") items = items.filter((i) => i.status === filterStatus);
    if (filterSource !== "All") items = items.filter((i) => i.sourceType === filterSource);

    items.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return a.date.localeCompare(b.date);
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return items;
  }, [searchQuery, filterProject, filterCategory, filterCreator, filterStatus, filterSource, sortBy]);

  const selectClasses =
    "h-9 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer";

  return (
    <div className="space-y-6">
      <PageHeader title="Library" description="All your saved and processed content">
        <Link href="/inbox">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
            Add Content
          </Button>
        </Link>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={selectClasses}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex border border-border/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex gap-3 flex-wrap p-4 rounded-lg bg-card/50 border border-border/30">
            <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className={selectClasses}>
              {PROJECTS.map((p) => <option key={p} value={p}>{p === "All" ? "All Projects" : p}</option>)}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClasses}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>
            <select value={filterCreator} onChange={(e) => setFilterCreator(e.target.value)} className={selectClasses}>
              {CREATORS.map((c) => <option key={c} value={c}>{c === "All" ? "All Creators" : c}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClasses}>
              <option value="All">All Statuses</option>
              {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>)}
            </select>
            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className={selectClasses}>
              <option value="All">All Sources</option>
              {SOURCE_TYPES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No content found"
          description="Try adjusting your search or filters, or add new content to get started."
          actionLabel="Add Content"
          actionHref="/inbox"
        />
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/library/${item.id}`}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-indigo-500/30 transition-all group h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${SOURCE_BADGES[item.sourceType] || SOURCE_BADGES.other}`}>
                    {item.sourceType.replace(/_/g, " ")}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[item.status] || STATUS_BADGES.draft}`}>
                    {REVIEW_STATUS_LABELS[item.status] || item.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.creator}</p>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                <p className="mt-3 text-[10px] text-muted-foreground">{item.date}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/library/${item.id}`}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold group-hover:text-indigo-400 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {item.creator} &middot; {item.category} &middot; {item.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${SOURCE_BADGES[item.sourceType]}`}>
                      {item.sourceType.replace(/_/g, " ")}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[item.status]}`}>
                      {REVIEW_STATUS_LABELS[item.status]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
