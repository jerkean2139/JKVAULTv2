"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, X, Video, Camera, Globe, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TRUST_LEVELS, TRUST_LEVEL_LABELS } from "@/lib/utils/constants";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  youtube: Video,
  instagram: Camera,
  web: Globe,
};

const PLATFORM_BADGES: Record<string, string> = {
  youtube: "bg-red-500/20 text-red-400",
  instagram: "bg-pink-500/20 text-pink-400",
  twitter: "bg-sky-500/20 text-sky-400",
  tiktok: "bg-zinc-500/20 text-zinc-300",
  podcast: "bg-purple-500/20 text-purple-400",
  web: "bg-emerald-500/20 text-emerald-400",
};

const TRUST_BADGE: Record<string, string> = {
  trusted: "bg-emerald-500/20 text-emerald-400",
  mixed: "bg-amber-500/20 text-amber-400",
  speculative: "bg-orange-500/20 text-orange-400",
  entertainment_only: "bg-zinc-500/20 text-zinc-400",
};

const MOCK_CREATORS = [
  {
    id: "1",
    name: "Alex Hormozi",
    platform: "youtube",
    contentCount: 12,
    trustLevel: "trusted",
    topThemes: ["Offers", "Pricing", "Scaling"],
    description: "Business acquisition and growth frameworks",
  },
  {
    id: "2",
    name: "Justin Welsh",
    platform: "twitter",
    contentCount: 8,
    trustLevel: "trusted",
    topThemes: ["Solopreneur", "Content", "LinkedIn"],
    description: "Building a one-person business to $5M+",
  },
  {
    id: "3",
    name: "Iman Gadzhi",
    platform: "youtube",
    contentCount: 5,
    trustLevel: "mixed",
    topThemes: ["Agency", "Education", "Marketing"],
    description: "Agency models and online education",
  },
  {
    id: "4",
    name: "Simon Sinek",
    platform: "youtube",
    contentCount: 4,
    trustLevel: "trusted",
    topThemes: ["Leadership", "Purpose", "Culture"],
    description: "Leadership and organizational culture",
  },
  {
    id: "5",
    name: "Ed Mylett",
    platform: "youtube",
    contentCount: 3,
    trustLevel: "trusted",
    topThemes: ["Mindset", "Performance", "Success"],
    description: "Peak performance and mindset strategies",
  },
  {
    id: "6",
    name: "Codie Sanchez",
    platform: "youtube",
    contentCount: 6,
    trustLevel: "trusted",
    topThemes: ["Boring Business", "Acquisitions", "Cash Flow"],
    description: "Buying boring businesses for cash flow",
  },
  {
    id: "7",
    name: "Gary Vee",
    platform: "instagram",
    contentCount: 9,
    trustLevel: "mixed",
    topThemes: ["Social Media", "Hustle", "Content"],
    description: "Social media and personal branding",
  },
  {
    id: "8",
    name: "Ali Abdaal",
    platform: "youtube",
    contentCount: 2,
    trustLevel: "trusted",
    topThemes: ["Productivity", "YouTube", "Creator Economy"],
    description: "Productivity and creator business",
  },
];

export default function CreatorsPage() {
  const [creators, setCreators] = useState(MOCK_CREATORS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCreator, setNewCreator] = useState({
    name: "",
    platform: "youtube",
    trustLevel: "mixed",
    description: "",
  });

  const handleAddCreator = () => {
    if (!newCreator.name.trim()) return;
    const created = {
      id: `new-${Date.now()}`,
      name: newCreator.name,
      platform: newCreator.platform,
      contentCount: 0,
      trustLevel: newCreator.trustLevel,
      topThemes: [],
      description: newCreator.description,
    };
    setCreators((prev) => [...prev, created]);
    setNewCreator({ name: "", platform: "youtube", trustLevel: "mixed", description: "" });
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Creators" description="Track creators whose content feeds your intelligence">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {creators.length} of 20 slots used
          </span>
          <Button
            onClick={() => setShowAddDialog(true)}
            disabled={creators.length >= 20}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Creator
          </Button>
        </div>
      </PageHeader>

      <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
          style={{ width: `${(creators.length / 20) * 100}%` }}
        />
      </div>

      {creators.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No creators tracked yet"
          description="Add creators whose content you want to analyze and learn from."
          actionLabel="Add Creator"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const PlatformIcon = PLATFORM_ICONS[creator.platform] || Globe;
            return (
              <Link key={creator.id} href={`/creators/${creator.id}`}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-indigo-500/30 transition-all group h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <PlatformIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold group-hover:text-indigo-400 transition-colors">
                          {creator.name}
                        </h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PLATFORM_BADGES[creator.platform] || PLATFORM_BADGES.web}`}>
                          {creator.platform}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${TRUST_BADGE[creator.trustLevel]}`}>
                      <Shield className="h-3 w-3" />
                      {TRUST_LEVEL_LABELS[creator.trustLevel]}
                    </span>
                  </div>
                  {creator.description && (
                    <p className="text-xs text-muted-foreground mb-3">{creator.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {creator.topThemes.map((theme) => (
                        <span
                          key={theme}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {creator.contentCount} items
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add Creator</h2>
              <button onClick={() => setShowAddDialog(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Creator name"
                  value={newCreator.name}
                  onChange={(e) => setNewCreator((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select
                  value={newCreator.platform}
                  onChange={(e) => setNewCreator((p) => ({ ...p, platform: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                <label className="block text-sm font-medium mb-1">Trust Level</label>
                <select
                  value={newCreator.trustLevel}
                  onChange={(e) => setNewCreator((p) => ({ ...p, trustLevel: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {TRUST_LEVELS.map((t) => (
                    <option key={t} value={t}>{TRUST_LEVEL_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What they teach or create"
                  value={newCreator.description}
                  onChange={(e) => setNewCreator((p) => ({ ...p, description: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCreator}
                  disabled={!newCreator.name.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  Add Creator
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
