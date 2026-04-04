"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  FileDown,
  FileText,
  Sparkles,
  MessageSquare,
  Tag,
  Lightbulb,
  BookOpen,
  GitCompare,
  Send,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { REVIEW_STATUSES, REVIEW_STATUS_LABELS } from "@/lib/utils/constants";

const MOCK_CONTENT = {
  id: "1",
  title: "Alex Hormozi - $100M Offers Framework",
  sourceType: "youtube",
  sourceUrl: "https://youtube.com/watch?v=example",
  creator: "Alex Hormozi",
  status: "reviewed",
  createdAt: "2026-04-03",
  rawText: `The key to creating an irresistible offer is understanding that people don't buy products - they buy outcomes. Your offer needs to make the dream outcome feel inevitable while reducing the perceived time, effort, and sacrifice required.

Step 1: Identify the dream outcome your customer wants more than anything.
Step 2: List every obstacle between them and that outcome.
Step 3: For each obstacle, create a solution.
Step 4: Bundle those solutions into a "Grand Slam Offer."
Step 5: Add urgency, scarcity, bonuses, and guarantees to make it a no-brainer.

The magic formula: Dream Outcome x Perceived Likelihood / Time Delay x Effort & Sacrifice = Value.`,
  summary: `Hormozi breaks down his "Grand Slam Offer" framework - a systematic approach to creating offers so compelling that people feel stupid saying no. The core insight is that value isn't about price; it's about the ratio of perceived dream outcome to perceived cost (time, effort, sacrifice). The framework involves identifying dream outcomes, mapping every obstacle, creating solutions for each, and bundling them with urgency elements.`,
  insights: [
    "Value is a ratio, not a number - increase the numerator (outcome + likelihood) and decrease the denominator (time + effort)",
    "Most businesses compete on price because their offers are commoditized - differentiation comes from stacking unique solutions",
    "Guarantees don't increase risk for the seller if the product is good - they reduce friction for the buyer",
    "Naming your offer with a unique mechanism creates category of one positioning",
    "Scarcity and urgency should be real, not manufactured - ethical constraints convert better long-term",
  ],
  hooks: [
    "What if your offer was so good, people felt stupid saying no?",
    "Stop competing on price. Start competing on value.",
    "The $100M question: Are you selling a product or an outcome?",
    "Your offer sucks. Here's exactly how to fix it.",
    "One framework changed how I think about pricing forever.",
  ],
  categories: ["Marketing", "Sales", "Offer Design"],
  tags: ["pricing", "value-creation", "grand-slam-offer", "hormozi"],
  categorizationReasoning: "This content directly addresses offer creation and pricing strategy, which falls under Marketing and Sales. The specific framework for bundling solutions maps to Offer Design as a subcategory. The emphasis on value perception over price points makes this a strategic marketing asset.",
  generatedOutputs: [
    {
      id: "g1",
      type: "facebook_post",
      title: "Grand Slam Offer Post",
      preview: "Most businesses compete on price. The best businesses compete on value...",
      status: "reviewed",
    },
    {
      id: "g2",
      type: "talking_head_script",
      title: "Value Equation Explainer",
      preview: "Today I want to break down the most important equation in business...",
      status: "draft",
    },
  ],
  notes: [
    {
      id: "n1",
      text: "Apply this to our coaching offer - need to map out all obstacles for new agents",
      createdAt: "2026-04-03T10:30:00Z",
    },
    {
      id: "n2",
      text: "Combine with the webinar framework from Justin Welsh for launch sequence",
      createdAt: "2026-04-03T14:15:00Z",
    },
  ],
  similarContent: [
    { id: "3", title: "The Agency Model is Dead", similarity: 0.78, creator: "Iman Gadzhi" },
    { id: "5", title: "Email Sequences That Convert", similarity: 0.65, creator: "You" },
  ],
};

type TabKey = "source" | "summary" | "insights" | "hooks" | "categories" | "generated" | "notes" | "similarity";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "source", label: "Source", icon: FileText },
  { key: "summary", label: "Summary", icon: BookOpen },
  { key: "insights", label: "Insights", icon: Lightbulb },
  { key: "hooks", label: "Hooks", icon: Sparkles },
  { key: "categories", label: "Categories & Tags", icon: Tag },
  { key: "generated", label: "Generated", icon: Sparkles },
  { key: "notes", label: "Notes", icon: MessageSquare },
  { key: "similarity", label: "Similarity", icon: GitCompare },
];

const STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  reviewed: "bg-emerald-500/20 text-emerald-400",
  favorite: "bg-amber-500/20 text-amber-400",
  needs_rewrite: "bg-red-500/20 text-red-400",
  ready_to_record: "bg-indigo-500/20 text-indigo-400",
  archived: "bg-zinc-500/20 text-zinc-400",
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState(MOCK_CONTENT);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [status, setStatus] = useState(MOCK_CONTENT.status);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(MOCK_CONTENT.notes);
  const [copied, setCopied] = useState<string | null>(null);

  const contentId = params.id as string;

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/content/${contentId}`);
        if (res.ok) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const d = data as any;
          const mapped = {
            ...MOCK_CONTENT,
            id: d.id,
            title: d.title,
            sourceType: d.sourceType,
            sourceUrl: d.sourceUrl || "",
            creator: d.savedCreator?.name || d.creatorNameRaw || "Unknown",
            status: d.status,
            createdAt: new Date(d.createdAt).toLocaleDateString(),
            rawText: d.transcriptText || d.rawText || d.extractedScreenshotText || MOCK_CONTENT.rawText,
            summary: d.shortSummary || d.detailedSummary || MOCK_CONTENT.summary,
            insights: Array.isArray(d.businessTakeawaysJson) ? d.businessTakeawaysJson as string[] : MOCK_CONTENT.insights,
            hooks: d.hookAnalysisJson
              ? [d.hookAnalysisJson.hook || d.hookAnalysisJson.openingHook || ""].filter(Boolean) as string[]
              : MOCK_CONTENT.hooks,
            categories: d.categories?.length
              ? d.categories.map((c: { category: { name: string } }) => c.category.name) as string[]
              : MOCK_CONTENT.categories,
            tags: d.tags?.length
              ? d.tags.map((t: { tag: { name: string } }) => t.tag.name) as string[]
              : MOCK_CONTENT.tags,
            categorizationReasoning: d.categorizationReasoning || MOCK_CONTENT.categorizationReasoning,
            generatedOutputs: d.generatedOutputs?.length
              ? d.generatedOutputs.map((o: { id: string; title: string; outputType: string; outputText?: string; reviewStatus?: string }) => ({
                  id: o.id, type: o.outputType, title: o.title,
                  preview: o.outputText?.slice(0, 100) || "", status: o.reviewStatus || "draft",
                }))
              : MOCK_CONTENT.generatedOutputs,
            notes: d.notes?.length
              ? d.notes.map((n: { id: string; body: string; createdAt: string }) => ({
                  id: n.id, text: n.body, createdAt: n.createdAt,
                }))
              : MOCK_CONTENT.notes,
          };
          setContent(mapped);
          setStatus(data.status);
          setNotes(mapped.notes);
        }
      } catch {
        // Use mock data as fallback
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [contentId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportMarkdown = () => {
    const md = `# ${content.title}\n\n## Summary\n${content.summary}\n\n## Key Insights\n${content.insights.map((i) => `- ${i}`).join("\n")}\n\n## Hooks\n${content.hooks.map((h) => `- ${h}`).join("\n")}\n\n## Source\n${content.rawText}`;
    handleCopy(md, "markdown");
  };

  const handleExportText = () => {
    const txt = `${content.title}\n\nSummary:\n${content.summary}\n\nInsights:\n${content.insights.map((i) => `- ${i}`).join("\n")}\n\nHooks:\n${content.hooks.map((h) => `- ${h}`).join("\n")}`;
    handleCopy(txt, "text");
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: `n${Date.now()}`, text: newNote, createdAt: new Date().toISOString() },
    ]);
    setNewNote("");
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      await fetch(`/api/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: newStatus }),
      });
    } catch {
      // API not ready yet, status updated locally
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 rounded bg-card/50 animate-pulse" />
        <div className="h-48 rounded-xl bg-card/50 animate-pulse" />
        <div className="h-96 rounded-xl bg-card/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <PageHeader
            title={content.title}
            description={`${content.creator} · ${content.sourceType.replace(/_/g, " ")} · ${content.createdAt}`}
          >
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-8 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {REVIEW_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {REVIEW_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={() => handleCopy(content.summary, "summary")}>
                {copied === "summary" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
                {copied === "markdown" ? <Check className="h-3 w-3 mr-1" /> : <FileDown className="h-3 w-3 mr-1" />}
                MD
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportText}>
                {copied === "text" ? <Check className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                TXT
              </Button>
              <Link href={`/generate?contentId=${contentId}`}>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate From This
                </Button>
              </Link>
            </div>
          </PageHeader>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap border-b border-border/30 pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "source" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Source Content</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleCopy(content.rawText, "source")}>
                {copied === "source" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                Copy Source
              </Button>
            </CardHeader>
            <CardContent>
              {content.sourceUrl && (
                <p className="mb-4 text-xs text-muted-foreground">
                  Source:{" "}
                  <a
                    href={content.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    {content.sourceUrl}
                  </a>
                </p>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {content.rawText}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "summary" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{content.summary}</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "insights" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.insights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 group"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-xs font-bold text-indigo-400">
                      {i + 1}
                    </div>
                    <p className="text-sm flex-1">{insight}</p>
                    <button
                      onClick={() => handleCopy(insight, `insight-${i}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      {copied === `insight-${i}` ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "hooks" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Content Hooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.hooks.map((hook, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 group"
                  >
                    <p className="text-sm font-medium italic">&ldquo;{hook}&rdquo;</p>
                    <button
                      onClick={() => handleCopy(hook, `hook-${i}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                    >
                      {copied === `hook-${i}` ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {content.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Categorization Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {content.categorizationReasoning}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "generated" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Outputs</CardTitle>
              <Link href={`/generate?contentId=${contentId}`}>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white" size="sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate New
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.generatedOutputs.map((output) => (
                  <Link
                    key={output.id}
                    href={`/ideas`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                          {output.type.replace(/_/g, " ")}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGES[output.status]}`}>
                          {REVIEW_STATUS_LABELS[output.status]}
                        </span>
                      </div>
                      <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors">
                        {output.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {output.preview}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "notes" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-muted/20">
                    <p className="text-sm">{note.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No notes yet. Add your first note below.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "similarity" && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Similar Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.similarContent.map((item) => (
                  <Link
                    key={item.id}
                    href={`/library/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {item.creator}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${item.similarity * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-indigo-400">
                        {Math.round(item.similarity * 100)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
