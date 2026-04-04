"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Library,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { REVIEW_STATUSES, REVIEW_STATUS_LABELS } from "@/lib/utils/constants";

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

interface ContentItemData {
  id: string;
  title: string;
  sourceType: string;
  creatorNameRaw?: string | null;
  savedCreator?: { name: string } | null;
  shortSummary?: string | null;
  status: string;
  project?: { name: string; color?: string | null } | null;
  categories?: { category: { name: string } }[];
  createdAt: string;
}

const SOURCE_TYPES_LIST = ["youtube", "youtube_short", "screenshot_set", "manual_text", "user_content", "other"];
const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

export default function LibraryPage() {
  const [items, setItems] = useState<ContentItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCreator, setFilterCreator] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [projects, setProjects] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [creators, setCreators] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filterStatus !== "All") params.set("status", filterStatus);
      if (filterSource !== "All") params.set("sourceType", filterSource);
      params.set("limit", "100");
      params.set("sort", sortBy === "date_asc" ? "oldest" : sortBy === "title_asc" ? "title" : "newest");

      const res = await fetch(`/api/content?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);

        // Extract unique filter values from data
        const projSet = new Set<string>();
        const catSet = new Set<string>();
        const creatorSet = new Set<string>();
        for (const item of data.items || []) {
          if (item.project?.name) projSet.add(item.project.name);
          if (item.savedCreator?.name) creatorSet.add(item.savedCreator.name);
          if (item.creatorNameRaw) creatorSet.add(item.creatorNameRaw);
          for (const c of item.categories || []) {
            if (c.category?.name) catSet.add(c.category.name);
          }
        }
        setProjects(Array.from(projSet).sort());
        setCategories(Array.from(catSet).sort());
        setCreators(Array.from(creatorSet).sort());
      }
    } catch {
      // API not available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterStatus, filterSource, sortBy]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (filterProject !== "All") {
      result = result.filter((i) => i.project?.name === filterProject);
    }
    if (filterCategory !== "All") {
      result = result.filter((i) =>
        i.categories?.some((c) => c.category.name === filterCategory)
      );
    }
    if (filterCreator !== "All") {
      result = result.filter(
        (i) => i.savedCreator?.name === filterCreator || i.creatorNameRaw === filterCreator
      );
    }
    // Client-side sort for title
    if (sortBy === "title_asc") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "title_desc") result.sort((a, b) => b.title.localeCompare(a.title));
    return result;
  }, [items, filterProject, filterCategory, filterCreator, sortBy]);

  const getCreatorName = (item: ContentItemData) =>
    item.savedCreator?.name || item.creatorNameRaw || "Unknown";

  const getFirstCategory = (item: ContentItemData) =>
    item.categories?.[0]?.category?.name || "";

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const selectClasses =
    "h-9 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer";

  return (
    <div className="space-y-6">
      <PageHeader title="Library" description="All your saved and processed content">
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClasses}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
              <option value="All">All Projects</option>
              {projects.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClasses}>
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterCreator} onChange={(e) => setFilterCreator(e.target.value)} className={selectClasses}>
              <option value="All">All Creators</option>
              {creators.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClasses}>
              <option value="All">All Statuses</option>
              {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>)}
            </select>
            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className={selectClasses}>
              <option value="All">All Sources</option>
              {SOURCE_TYPES_LIST.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/50 bg-card/50 p-5 animate-pulse">
              <div className="h-4 w-24 rounded bg-muted/50 mb-3" />
              <div className="h-5 w-full rounded bg-muted/50 mb-2" />
              <div className="h-3 w-20 rounded bg-muted/50 mb-2" />
              <div className="h-3 w-full rounded bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No content found"
          description={items.length === 0
            ? "Your library is empty. Add content from the Inbox to get started."
            : "Try adjusting your search or filters."}
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
                  {getFirstCategory(item) && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                      {getFirstCategory(item)}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{getCreatorName(item)}</p>
                {item.shortSummary && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{item.shortSummary.split("\n")[0]}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  {item.project && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.project.color || "#6366f1" }} />
                      {item.project.name}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{formatDate(item.createdAt)}</span>
                </div>
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
                      {getCreatorName(item)} &middot; {getFirstCategory(item)} &middot; {item.shortSummary?.split("\n")[0] || ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${SOURCE_BADGES[item.sourceType] || SOURCE_BADGES.other}`}>
                      {item.sourceType.replace(/_/g, " ")}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[item.status] || STATUS_BADGES.draft}`}>
                      {REVIEW_STATUS_LABELS[item.status] || item.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground py-4">
        {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} in library
      </div>
    </div>
  );
}
