"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  FileDown,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  OUTPUT_TYPES,
  OUTPUT_TYPE_LABELS,
  CONTENT_MODES,
  CONTENT_MODE_LABELS,
  AUDIENCES,
} from "@/lib/utils/constants";

const MOCK_CONTENT_ITEMS = [
  { id: "1", title: "Alex Hormozi - $100M Offers Framework" },
  { id: "2", title: "Content Repurposing Masterclass" },
  { id: "3", title: "The Agency Model is Dead" },
  { id: "4", title: "How to Build Systems That Scale" },
  { id: "5", title: "Email Sequences That Convert" },
  { id: "6", title: "Leadership in Remote Teams" },
  { id: "7", title: "AI Workflows for Solopreneurs" },
  { id: "8", title: "Mindset Shifts for 7-Figure Growth" },
];

const MOCK_CREATORS = [
  { id: "1", name: "Alex Hormozi" },
  { id: "2", name: "Justin Welsh" },
  { id: "3", name: "Iman Gadzhi" },
  { id: "4", name: "Simon Sinek" },
  { id: "5", name: "Ed Mylett" },
];

const MOCK_PROJECTS = [
  { id: "1", name: "Offer Design" },
  { id: "2", name: "Content Engine" },
  { id: "3", name: "Business Models" },
  { id: "4", name: "Scaling Playbook" },
];

const MOCK_CATEGORIES = ["Marketing", "Systems", "Leadership", "AI & Tech", "Mindset", "Sales"];

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const preselectedContentId = searchParams.get("contentId");

  const [selectedContent, setSelectedContent] = useState<string[]>(
    preselectedContentId ? [preselectedContentId] : []
  );
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>(AUDIENCES[0]);
  const [outputType, setOutputType] = useState<string>(OUTPUT_TYPES[0]);
  const [contentMode, setContentMode] = useState<string>(CONTENT_MODES[0]);
  const [originalityLevel, setOriginalityLevel] = useState(70);
  const [meshMethodology, setMeshMethodology] = useState(true);
  const [toneNotes, setToneNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedOutput(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentIds: selectedContent,
          creatorIds: selectedCreators,
          projectId: selectedProject,
          category: selectedCategory,
          audience: selectedAudience,
          outputType,
          contentMode,
          originalityLevel,
          meshMethodology,
          toneNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedOutput(data.output || data.generatedText);
        setGeneratedId(data.id);
      } else {
        setGeneratedOutput(MOCK_GENERATED_OUTPUT);
        setGeneratedId("mock-gen-1");
      }
    } catch {
      setGeneratedOutput(MOCK_GENERATED_OUTPUT);
      setGeneratedId("mock-gen-1");
    }

    setGenerating(false);
  };

  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = async (value: string) => {
    setFeedback(feedback === value ? null : value);
    if (generatedId) {
      try {
        await fetch(`/api/generate/${generatedId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback: value }),
        });
      } catch {
        // API not ready
      }
    }
  };

  const toggleContentItem = (id: string) => {
    setSelectedContent((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCreator = (id: string) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectClasses =
    "w-full h-10 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate"
        description="Create original content from your intelligence library"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">Source Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {MOCK_CONTENT_ITEMS.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                      selectedContent.includes(item.id)
                        ? "bg-indigo-500/10 text-indigo-300"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => toggleContentItem(item.id)}
                      className="rounded border-border/50 bg-muted/30 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="truncate">{item.title}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">Style Reference (Creators)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOCK_CREATORS.map((creator) => (
                  <button
                    key={creator.id}
                    onClick={() => toggleCreator(creator.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCreators.includes(creator.id)
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    {creator.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Project</label>
                  <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className={selectClasses}>
                    <option value="">None</option>
                    {MOCK_PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={selectClasses}>
                    <option value="">Auto-detect</option>
                    {MOCK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Target Audience</label>
                  <select value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)} className={selectClasses}>
                    {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Output Type</label>
                  <select value={outputType} onChange={(e) => setOutputType(e.target.value)} className={selectClasses}>
                    {OUTPUT_TYPES.map((t) => <option key={t} value={t}>{OUTPUT_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Content Mode</label>
                  <select value={contentMode} onChange={(e) => setContentMode(e.target.value)} className={selectClasses}>
                    {CONTENT_MODES.map((m) => <option key={m} value={m}>{CONTENT_MODE_LABELS[m]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Originality Level: {originalityLevel}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={originalityLevel}
                    onChange={(e) => setOriginalityLevel(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted/30 accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Close to source</span>
                    <span>Highly original</span>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      meshMethodology ? "bg-indigo-500" : "bg-muted"
                    }`}
                    onClick={() => setMeshMethodology(!meshMethodology)}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        meshMethodology ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                  <span className="text-sm">Mesh with my methodology</span>
                </label>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tone Notes (optional)
                  </label>
                  <textarea
                    value={toneNotes}
                    onChange={(e) => setToneNotes(e.target.value)}
                    placeholder="Any specific tone or style notes for this generation..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={generating || selectedContent.length === 0}
            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base font-semibold"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="lg:col-span-3">
          {generating && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium">Generating your content...</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Analyzing sources, applying style, crafting output
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!generating && !generatedOutput && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-indigo-400/50" />
                  </div>
                  <h3 className="text-lg font-semibold">Ready to Generate</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Select source content, configure your settings, and hit Generate to create
                    original content in your voice.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!generating && generatedOutput && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Generated Output
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {OUTPUT_TYPE_LABELS[outputType]}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([generatedOutput], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "generated-output.md";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <FileDown className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  {generatedId && (
                    <Link href={`/generate/record/${generatedId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Record View
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed mb-6 p-4 rounded-lg bg-muted/10 border border-border/20">
                  {generatedOutput}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-border/20">
                  <span className="text-xs text-muted-foreground mr-2">Feedback:</span>
                  <button
                    onClick={() => handleFeedback("nailed_it")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      feedback === "nailed_it"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3" /> Nailed It
                  </button>
                  <button
                    onClick={() => handleFeedback("too_generic")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      feedback === "too_generic"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    <Minus className="h-3 w-3" /> Too Generic
                  </button>
                  <button
                    onClick={() => handleFeedback("more_like_me")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      feedback === "more_like_me"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    <ThumbsDown className="h-3 w-3" /> More Like Me
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
      <GeneratePageContent />
    </Suspense>
  );
}

const MOCK_GENERATED_OUTPUT = `**HOOK:** What if I told you that 90% of businesses are leaving money on the table - not because they don't have a good product, but because their offer is invisible?

---

**THE PROBLEM:**

Most businesses compete on price. They race to the bottom, slashing margins, burning out, and wondering why their "great product" isn't selling.

Here's the truth nobody wants to hear: **Your product isn't the problem. Your offer is.**

---

**THE FRAMEWORK:**

I call it the Value Stack Method, and it comes down to one equation:

**Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort Required)**

To make your offer irresistible, you need to:

1. **Maximize the dream outcome** - Make it specific and vivid. Not "grow your business" but "add $50K/month in recurring revenue within 90 days."

2. **Increase perceived likelihood** - Stack proof. Testimonials, case studies, guarantees. Remove every shred of doubt.

3. **Minimize time delay** - Speed to result matters. Quick wins build trust and momentum.

4. **Reduce effort required** - Done-for-you beats DIY every time. Make it easy to say yes.

---

**THE SHIFT:**

Stop selling your "coaching program" or your "marketing service." Start selling the **outcome** your client desperately wants.

Bundle your solutions. Stack the value. Add a guarantee that demonstrates YOUR confidence in YOUR product.

---

**CTA:** If this framework resonated, drop a comment below with your current offer and I'll tell you the #1 thing I'd change to make it irresistible.`;
