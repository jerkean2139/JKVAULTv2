"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Video,
  Shield,
  FileText,
  Sparkles,
  Palette,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TRUST_LEVELS,
  TRUST_LEVEL_LABELS,
  REVIEW_STATUS_LABELS,
} from "@/lib/utils/constants";

const STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  reviewed: "bg-emerald-500/20 text-emerald-400",
  favorite: "bg-amber-500/20 text-amber-400",
  needs_rewrite: "bg-red-500/20 text-red-400",
  ready_to_record: "bg-indigo-500/20 text-indigo-400",
  archived: "bg-zinc-500/20 text-zinc-400",
};

const MOCK_CREATOR = {
  id: "1",
  name: "Alex Hormozi",
  platform: "youtube",
  channelUrl: "https://youtube.com/@AlexHormozi",
  trustLevel: "trusted",
  description: "Business acquisition and growth frameworks",
  styleFingerprint: {
    toneWords: ["direct", "high-energy", "confident", "no-BS"],
    hookStyle: "Bold contrarian statement followed by a promise of value",
    structurePattern: "Hook > Problem > Framework > Proof > CTA",
    vocabularyNotes: "Uses business metaphors, gym analogies, simple language for complex concepts",
    deliveryStyle: "Fast-paced, emphatic pauses, repetition for emphasis",
  },
  savedContent: [
    {
      id: "1",
      title: "$100M Offers Framework",
      status: "reviewed",
      date: "2026-04-03",
    },
    {
      id: "9",
      title: "$100M Leads - The Advertising Playbook",
      status: "favorite",
      date: "2026-03-25",
    },
    {
      id: "10",
      title: "How to Price Your Services",
      status: "draft",
      date: "2026-03-20",
    },
    {
      id: "11",
      title: "The Value Equation Explained",
      status: "reviewed",
      date: "2026-03-15",
    },
  ],
};

export default function CreatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: MOCK_CREATOR.name,
    platform: MOCK_CREATOR.platform,
    channelUrl: MOCK_CREATOR.channelUrl,
    trustLevel: MOCK_CREATOR.trustLevel,
    description: MOCK_CREATOR.description,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/creators/${creatorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // API not ready yet
    }
    setSaving(false);
    setEditing(false);
  };

  const inputClasses =
    "w-full h-10 px-4 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <PageHeader
            title={MOCK_CREATOR.name}
            description={`${MOCK_CREATOR.platform} · ${MOCK_CREATOR.savedContent.length} content items`}
          >
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit Creator
                </Button>
              )}
              <Link href={`/generate?creatorId=${creatorId}`}>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white" size="sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate In Style
                </Button>
              </Link>
            </div>
          </PageHeader>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-red-400" />
                Creator Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Platform</label>
                    <select
                      value={form.platform}
                      onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                      className={inputClasses}
                    >
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="tiktok">TikTok</option>
                      <option value="podcast">Podcast</option>
                      <option value="web">Web/Blog</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Channel URL</label>
                    <input
                      type="url"
                      value={form.channelUrl}
                      onChange={(e) => setForm((p) => ({ ...p, channelUrl: e.target.value }))}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Trust Level</label>
                    <select
                      value={form.trustLevel}
                      onChange={(e) => setForm((p) => ({ ...p, trustLevel: e.target.value }))}
                      className={inputClasses}
                    >
                      {TRUST_LEVELS.map((t) => (
                        <option key={t} value={t}>{TRUST_LEVEL_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      className={inputClasses}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <Video className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{MOCK_CREATOR.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{MOCK_CREATOR.platform}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{MOCK_CREATOR.description}</p>
                  {MOCK_CREATOR.channelUrl && (
                    <a
                      href={MOCK_CREATOR.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:underline block"
                    >
                      {MOCK_CREATOR.channelUrl}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm">
                      {TRUST_LEVEL_LABELS[MOCK_CREATOR.trustLevel]}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-400" />
                Style Fingerprint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Tone Words</p>
                  <div className="flex gap-2 flex-wrap">
                    {MOCK_CREATOR.styleFingerprint.toneWords.map((word) => (
                      <span
                        key={word}
                        className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Hook Style</p>
                  <p className="text-sm">{MOCK_CREATOR.styleFingerprint.hookStyle}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Structure Pattern</p>
                  <p className="text-sm">{MOCK_CREATOR.styleFingerprint.structurePattern}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Vocabulary Notes</p>
                  <p className="text-sm">{MOCK_CREATOR.styleFingerprint.vocabularyNotes}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Delivery Style</p>
                  <p className="text-sm">{MOCK_CREATOR.styleFingerprint.deliveryStyle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                Saved Content
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {MOCK_CREATOR.savedContent.length} items
              </span>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_CREATOR.savedContent.map((item) => (
                  <Link
                    key={item.id}
                    href={`/library/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGES[item.status]}`}>
                      {REVIEW_STATUS_LABELS[item.status]}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
