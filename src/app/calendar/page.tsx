"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutList,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { OUTPUT_TYPE_LABELS } from "@/lib/utils/constants";

interface CalendarItem {
  id: string;
  title: string;
  type: "content" | "generated";
  outputType?: string;
  date: string;
  status: string;
}

const FALLBACK_ITEMS: CalendarItem[] = [
  { id: "g1", title: "Stop Selling Products, Start Selling Outcomes", type: "generated", outputType: "facebook_post", date: "2026-04-07", status: "reviewed" },
  { id: "g2", title: "The Value Equation Explainer", type: "generated", outputType: "talking_head_script", date: "2026-04-08", status: "ready_to_record" },
  { id: "g5", title: "Why Your Agency Model Is Broken", type: "generated", outputType: "reel_script", date: "2026-04-10", status: "ready_to_record" },
  { id: "g3", title: "5 Systems That Eliminated 20 Hours", type: "generated", outputType: "content_idea", date: "2026-04-14", status: "draft" },
  { id: "g6", title: "Email Welcome Sequence Template", type: "generated", outputType: "email", date: "2026-04-15", status: "reviewed" },
  { id: "g4", title: "The Grand Slam Offer Checklist", type: "generated", outputType: "carousel_outline", date: "2026-04-18", status: "draft" },
];

const TYPE_COLORS: Record<string, string> = {
  content: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  generated: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const STATUS_DOT: Record<string, string> = {
  draft: "bg-zinc-400",
  reviewed: "bg-emerald-400",
  favorite: "bg-amber-400",
  ready_to_record: "bg-indigo-400",
  archived: "bg-zinc-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [items, setItems] = useState<CalendarItem[]>(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendarData() {
      try {
        const [genRes, contentRes] = await Promise.allSettled([
          fetch("/api/generate?limit=100").then((r) => r.ok ? r.json() : null),
          fetch("/api/content?limit=100").then((r) => r.ok ? r.json() : null),
        ]);

        const calItems: CalendarItem[] = [];

        if (genRes.status === "fulfilled" && genRes.value?.items) {
          for (const g of genRes.value.items) {
            const date = g.targetPublishDate
              ? new Date(g.targetPublishDate).toISOString().split("T")[0]
              : g.createdAt
                ? new Date(g.createdAt).toISOString().split("T")[0]
                : null;
            if (date) {
              calItems.push({
                id: g.id,
                title: g.title || g.outputType || "Untitled Output",
                type: "generated",
                outputType: g.outputType,
                date,
                status: g.reviewStatus || "draft",
              });
            }
          }
        }

        if (contentRes.status === "fulfilled" && contentRes.value?.items) {
          for (const c of contentRes.value.items) {
            const date = c.targetPublishDate
              ? new Date(c.targetPublishDate).toISOString().split("T")[0]
              : null;
            if (date) {
              calItems.push({
                id: c.id,
                title: c.title || "Untitled Content",
                type: "content",
                date,
                status: c.status || "draft",
              });
            }
          }
        }

        if (calItems.length > 0) {
          setItems(calItems);
        }
      } catch {
        // Keep fallback
      }
      setLoading(false);
    }
    loadCalendarData();
  }, []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const formatDate = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const itemsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const item of items) {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    }
    return map;
  }, [items]);

  const selectedItems = selectedDate ? itemsByDate[selectedDate] || [] : [];

  const monthItems = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    return items.filter((item) => item.date.startsWith(prefix)).sort(
      (a, b) => a.date.localeCompare(b.date)
    );
  }, [currentYear, currentMonth, items]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Calendar" description="Content publishing schedule" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Content publishing schedule">
        <div className="flex items-center gap-2">
          <div className="flex border border-border/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-2 ${viewMode === "calendar" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </PageHeader>

      {viewMode === "calendar" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex-row items-center justify-between">
                <Button variant="ghost" size="icon-sm" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-base">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </CardTitle>
                <Button variant="ghost" size="icon-sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-px">
                  {DAY_NAMES.map((day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = formatDate(day);
                    const dayItems = itemsByDate[dateStr] || [];
                    const isSelected = selectedDate === dateStr;
                    const isToday =
                      day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`h-20 p-1 rounded-lg text-left transition-all flex flex-col ${
                          isSelected
                            ? "bg-indigo-500/10 border border-indigo-500/30"
                            : "hover:bg-muted/30 border border-transparent"
                        }`}
                      >
                        <span
                          className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday
                              ? "bg-indigo-500 text-white"
                              : "text-muted-foreground"
                          }`}
                        >
                          {day}
                        </span>
                        <div className="flex flex-col gap-0.5 mt-1 overflow-hidden flex-1">
                          {dayItems.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className={`text-[9px] px-1 py-0.5 rounded truncate border ${TYPE_COLORS[item.type]}`}
                            >
                              {item.title}
                            </div>
                          ))}
                          {dayItems.length > 2 && (
                            <span className="text-[9px] text-muted-foreground pl-1">
                              +{dayItems.length - 2} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDate
                    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Click a date on the calendar to see scheduled items.
                  </p>
                ) : selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No items scheduled for this date.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <Link
                        key={item.id}
                        href={
                          item.type === "content"
                            ? `/library/${item.id}`
                            : `/generate/record/${item.id}`
                        }
                        className="block p-3 rounded-lg hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${STATUS_DOT[item.status] || STATUS_DOT.draft}`} />
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type]}`}>
                            {item.type === "generated" && item.outputType
                              ? OUTPUT_TYPE_LABELS[item.outputType]
                              : item.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors">
                          {item.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          {monthItems.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="No scheduled content"
              description="No content is scheduled for this month. Generate some content and set publish dates."
              actionLabel="Generate Content"
              actionHref="/generate"
            />
          ) : (
            <div className="space-y-3">
              {monthItems.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.type === "content"
                      ? `/library/${item.id}`
                      : `/generate/record/${item.id}`
                  }
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:border-indigo-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-center shrink-0 w-12">
                          <p className="text-lg font-bold">{new Date(item.date + "T12:00:00").getDate()}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(item.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[item.status]}`} />
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type]}`}>
                              {item.type === "generated" && item.outputType
                                ? OUTPUT_TYPE_LABELS[item.outputType]
                                : item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
