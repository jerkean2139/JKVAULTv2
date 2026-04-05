"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Check,
  Mic,
  Settings as SettingsIcon,
  Users,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AUDIENCES,
  OUTPUT_TYPES,
  OUTPUT_TYPE_LABELS,
  TRUST_LEVELS,
  TRUST_LEVEL_LABELS,
} from "@/lib/utils/constants";

type SettingsTab = "voice" | "preferences" | "creators" | "export";

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "voice", label: "Voice & Methodology", icon: Mic },
  { key: "preferences", label: "Preferences", icon: SettingsIcon },
  { key: "creators", label: "Creators Quick Manage", icon: Users },
  { key: "export", label: "Export Settings", icon: Download },
];

const MOCK_CREATORS = [
  { id: "1", name: "Alex Hormozi", trustLevel: "trusted", platform: "youtube" },
  { id: "2", name: "Justin Welsh", trustLevel: "trusted", platform: "twitter" },
  { id: "3", name: "Iman Gadzhi", trustLevel: "mixed", platform: "youtube" },
  { id: "4", name: "Simon Sinek", trustLevel: "trusted", platform: "youtube" },
  { id: "5", name: "Ed Mylett", trustLevel: "trusted", platform: "youtube" },
  { id: "6", name: "Codie Sanchez", trustLevel: "trusted", platform: "youtube" },
  { id: "7", name: "Gary Vee", trustLevel: "mixed", platform: "instagram" },
  { id: "8", name: "Ali Abdaal", trustLevel: "trusted", platform: "youtube" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("voice");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [methodologyName, setMethodologyName] = useState("The Leverage Framework");
  const [methodologyDescription, setMethodologyDescription] = useState(
    "A systematic approach to building leverage in business through content, systems, and strategic positioning. Focuses on creating compounding assets rather than trading time for money."
  );
  const [toneNotes, setToneNotes] = useState(
    "Direct and confident but not arrogant. Use real examples over theory. Conversational but professional. Teach through stories and frameworks."
  );
  const [prohibitedPhrases, setProhibitedPhrases] = useState(
    "hustle harder, grind mentality, passive income, get rich quick, hack, guru"
  );
  const [preferredPhrases, setPreferredPhrases] = useState(
    "leverage, systems thinking, compound effect, strategic positioning, build once sell twice"
  );
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([
    "State Farm agents",
    "Small business owners",
    "Coaches & consultants",
  ]);
  const [contentGoals, setContentGoals] = useState(
    "Establish authority in business systems and scaling. Build trust through teaching. Drive enrollment in coaching programs and workshops."
  );
  const [brandThemes, setBrandThemes] = useState(
    "Leverage over labor, Systems over hustle, Strategy over tactics, Teaching over selling"
  );
  const [defaultOriginality, setDefaultOriginality] = useState(70);
  const [defaultCtaStyles, setDefaultCtaStyles] = useState(
    "Comment-based engagement, DM for resource, Link to free training"
  );

  const [defaultOutputFormat, setDefaultOutputFormat] = useState("facebook_post");
  const [autoReview, setAutoReview] = useState(true);
  const [reviewReminders, setReviewReminders] = useState(true);
  const [markdownExport, setMarkdownExport] = useState(true);

  const [creatorsLocal, setCreatorsLocal] = useState(MOCK_CREATORS);
  const [, setSettingsLoaded] = useState(false);

  // Load saved settings and real creators on mount
  useEffect(() => {
    async function loadData() {
      const [settingsRes, creatorsRes] = await Promise.allSettled([
        fetch("/api/settings").then((r) => r.ok ? r.json() : null),
        fetch("/api/creators").then((r) => r.ok ? r.json() : null),
      ]);

      if (settingsRes.status === "fulfilled" && settingsRes.value) {
        const s = settingsRes.value;
        if (s.methodologyName) setMethodologyName(s.methodologyName as string);
        if (s.methodologyDescription) setMethodologyDescription(s.methodologyDescription as string);
        if (s.toneNotes) setToneNotes(s.toneNotes as string);
        if (s.contentGoals) setContentGoals(s.contentGoals as string);
        if (Array.isArray(s.prohibitedPhrases)) setProhibitedPhrases((s.prohibitedPhrases as string[]).join(", "));
        if (Array.isArray(s.preferredPhrases)) setPreferredPhrases((s.preferredPhrases as string[]).join(", "));
        if (Array.isArray(s.targetAudiences)) setSelectedAudiences(s.targetAudiences as string[]);
        if (Array.isArray(s.brandThemes)) setBrandThemes((s.brandThemes as string[]).join(", "));
        if (typeof s.defaultOriginalityLevel === "number") setDefaultOriginality(s.defaultOriginalityLevel);
        if (Array.isArray(s.defaultCtaStyles)) setDefaultCtaStyles((s.defaultCtaStyles as string[]).join(", "));
        if (s.defaultOutputFormat) setDefaultOutputFormat(s.defaultOutputFormat as string);
        if (typeof s.autoReview === "boolean") setAutoReview(s.autoReview);
        if (typeof s.reviewReminders === "boolean") setReviewReminders(s.reviewReminders);
        if (typeof s.markdownExport === "boolean") setMarkdownExport(s.markdownExport);
        if (s.exportFormat) setExportFormat(s.exportFormat as string);
        if (typeof s.includeRaw === "boolean") setIncludeRaw(s.includeRaw);
        if (typeof s.includeGenerated === "boolean") setIncludeGenerated(s.includeGenerated);
      }

      if (creatorsRes.status === "fulfilled" && Array.isArray(creatorsRes.value) && creatorsRes.value.length) {
        setCreatorsLocal(creatorsRes.value.map((c: { id: string; name: string; trustLevel?: string; platform?: string }) => ({
          id: c.id,
          name: c.name,
          trustLevel: c.trustLevel || "trusted",
          platform: c.platform || "youtube",
        })));
      }

      setSettingsLoaded(true);
    }
    loadData();
  }, []);

  const [exportFormat, setExportFormat] = useState("json");
  const [includeRaw, setIncludeRaw] = useState(true);
  const [includeGenerated, setIncludeGenerated] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          methodologyName,
          methodologyDescription,
          toneNotes,
          prohibitedPhrases: prohibitedPhrases.split(",").map((s) => s.trim()).filter(Boolean),
          preferredPhrases: preferredPhrases.split(",").map((s) => s.trim()).filter(Boolean),
          targetAudiences: selectedAudiences,
          contentGoals,
          brandThemes: brandThemes.split(",").map((s) => s.trim()).filter(Boolean),
          defaultOriginalityLevel: defaultOriginality,
          defaultCtaStyles: defaultCtaStyles.split(",").map((s) => s.trim()).filter(Boolean),
          defaultOutputFormat,
          autoReview,
          reviewReminders,
          markdownExport,
          exportFormat,
          includeRaw,
          includeGenerated,
        }),
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleAudience = (audience: string) => {
    setSelectedAudiences((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience]
    );
  };

  const handleCreatorTrustChange = (id: string, newTrust: string) => {
    setCreatorsLocal((prev) =>
      prev.map((c) => (c.id === id ? { ...c, trustLevel: newTrust } : c))
    );
  };

  const inputClasses =
    "w-full h-10 px-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
  const textareaClasses =
    "w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y";

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your Creator Intelligence Studio">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </Button>
      </PageHeader>

      <div className="flex gap-2 flex-wrap border-b border-border/30 pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "voice" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Methodology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Methodology Name
                  </label>
                  <input
                    type="text"
                    value={methodologyName}
                    onChange={(e) => setMethodologyName(e.target.value)}
                    placeholder="Your methodology name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    value={methodologyDescription}
                    onChange={(e) => setMethodologyDescription(e.target.value)}
                    placeholder="Describe your methodology..."
                    rows={4}
                    className={textareaClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Content Goals
                  </label>
                  <textarea
                    value={contentGoals}
                    onChange={(e) => setContentGoals(e.target.value)}
                    placeholder="What are your content goals?"
                    rows={3}
                    className={textareaClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Brand Themes (comma-separated)
                  </label>
                  <textarea
                    value={brandThemes}
                    onChange={(e) => setBrandThemes(e.target.value)}
                    placeholder="Theme 1, Theme 2, Theme 3"
                    rows={2}
                    className={textareaClasses}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Voice & Tone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tone Notes
                  </label>
                  <textarea
                    value={toneNotes}
                    onChange={(e) => setToneNotes(e.target.value)}
                    placeholder="Describe your tone and voice..."
                    rows={4}
                    className={textareaClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Prohibited Phrases (comma-separated)
                  </label>
                  <textarea
                    value={prohibitedPhrases}
                    onChange={(e) => setProhibitedPhrases(e.target.value)}
                    placeholder="phrase 1, phrase 2, phrase 3"
                    rows={2}
                    className={textareaClasses}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prohibitedPhrases
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((phrase) => (
                        <span
                          key={phrase}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                        >
                          {phrase}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Preferred Phrases (comma-separated)
                  </label>
                  <textarea
                    value={preferredPhrases}
                    onChange={(e) => setPreferredPhrases(e.target.value)}
                    placeholder="phrase 1, phrase 2, phrase 3"
                    rows={2}
                    className={textareaClasses}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preferredPhrases
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((phrase) => (
                        <span
                          key={phrase}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          {phrase}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Target Audiences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {AUDIENCES.map((audience) => (
                  <label
                    key={audience}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAudiences.includes(audience)
                        ? "bg-indigo-500/10 border border-indigo-500/20"
                        : "hover:bg-muted/30 border border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAudiences.includes(audience)}
                      onChange={() => toggleAudience(audience)}
                      className="rounded border-border/50 bg-muted/30 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm">{audience}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Generation Defaults</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Default Originality Level: {defaultOriginality}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={defaultOriginality}
                    onChange={(e) => setDefaultOriginality(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted/30 accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Close to source</span>
                    <span>Highly original</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Default CTA Styles (comma-separated)
                  </label>
                  <textarea
                    value={defaultCtaStyles}
                    onChange={(e) => setDefaultCtaStyles(e.target.value)}
                    placeholder="CTA style 1, CTA style 2"
                    rows={2}
                    className={textareaClasses}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="max-w-2xl space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Output Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Default Output Format
                  </label>
                  <select
                    value={defaultOutputFormat}
                    onChange={(e) => setDefaultOutputFormat(e.target.value)}
                    className={inputClasses}
                  >
                    {OUTPUT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {OUTPUT_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Review Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Auto-mark as draft for review</p>
                    <p className="text-xs text-muted-foreground">
                      New generated outputs will be marked as draft automatically
                    </p>
                  </div>
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      autoReview ? "bg-indigo-500" : "bg-muted"
                    }`}
                    onClick={() => setAutoReview(!autoReview)}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        autoReview ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Review reminders</p>
                    <p className="text-xs text-muted-foreground">
                      Show pending review count on the dashboard
                    </p>
                  </div>
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      reviewReminders ? "bg-indigo-500" : "bg-muted"
                    }`}
                    onClick={() => setReviewReminders(!reviewReminders)}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        reviewReminders ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Markdown export by default</p>
                    <p className="text-xs text-muted-foreground">
                      Use markdown formatting when copying or exporting content
                    </p>
                  </div>
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      markdownExport ? "bg-indigo-500" : "bg-muted"
                    }`}
                    onClick={() => setMarkdownExport(!markdownExport)}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        markdownExport ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "creators" && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm max-w-3xl">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Creators ({creatorsLocal.length}/20)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {creatorsLocal.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <span className="text-xs font-bold text-indigo-400">
                        {creator.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{creator.platform}</p>
                    </div>
                  </div>
                  <select
                    value={creator.trustLevel}
                    onChange={(e) => handleCreatorTrustChange(creator.id, e.target.value)}
                    className="h-8 px-2 rounded-lg bg-muted/30 border border-border/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {TRUST_LEVELS.map((t) => (
                      <option key={t} value={t}>
                        {TRUST_LEVEL_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "export" && (
        <div className="max-w-2xl space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Export Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Default Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                    <option value="csv">CSV</option>
                    <option value="text">Plain Text</option>
                  </select>
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Include raw content</p>
                    <p className="text-xs text-muted-foreground">
                      Include original source text in exports
                    </p>
                  </div>
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      includeRaw ? "bg-indigo-500" : "bg-muted"
                    }`}
                    onClick={() => setIncludeRaw(!includeRaw)}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        includeRaw ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Include generated outputs</p>
                    <p className="text-xs text-muted-foreground">
                      Include AI-generated content in exports
                    </p>
                  </div>
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      includeGenerated ? "bg-indigo-500" : "bg-muted"
                    }`}
                    onClick={() => setIncludeGenerated(!includeGenerated)}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        includeGenerated ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Bulk Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const data = JSON.stringify({ exportedAt: new Date().toISOString(), settings: "mock" }, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "creator-intelligence-export.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const data = JSON.stringify({ exportedAt: new Date().toISOString(), settings: "mock" }, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "generated-outputs-export.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Generated Outputs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const data = JSON.stringify({
                      exportedAt: new Date().toISOString(),
                      methodologyName,
                      methodologyDescription,
                      toneNotes,
                      prohibitedPhrases,
                      preferredPhrases,
                      selectedAudiences,
                      contentGoals,
                      brandThemes,
                      defaultOriginality,
                    }, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "voice-settings-export.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Voice & Methodology Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
