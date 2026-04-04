"use client";

import Link from "next/link";
import {
  Inbox,
  Library,
  Sparkles,
  TrendingUp,
  Users,
  Settings,
  Video,
  FileText,
  Camera,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Monitor,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: 1,
    title: "Set Up Your Voice",
    description: "Configure your methodology, tone, audiences, and brand themes in Settings. This shapes how all generated content sounds.",
    icon: Settings,
    href: "/settings",
    tips: [
      "Add your methodology name and description",
      "Set prohibited phrases (words you never want in your content)",
      "Define your target audiences",
      "Set brand themes that should run through all content",
    ],
  },
  {
    number: 2,
    title: "Add Content to Your Brain",
    description: "Use the Inbox to feed content into your library. Paste YouTube links, upload screenshots, or enter text manually.",
    icon: Inbox,
    href: "/inbox",
    tips: [
      "YouTube links auto-extract transcripts when available",
      "Use 'Manual Text' for articles, podcast notes, or book highlights",
      "Use 'My Content' to add your own past posts and frameworks",
      "Screenshots get OCR text extraction automatically",
    ],
  },
  {
    number: 3,
    title: "Review Your Library",
    description: "Every piece of content gets AI-analyzed: summaries, hook analysis, persuasion angles, categorization, and more.",
    icon: Library,
    href: "/library",
    tips: [
      "Click any item to see the full analysis breakdown",
      "Use status labels (draft, reviewed, favorite) to organize",
      "Filter by project, category, or creator to find content fast",
      "Add notes to capture your own thoughts on each piece",
    ],
  },
  {
    number: 4,
    title: "Track Creators",
    description: "Save up to 20 content creators you follow. The system builds style fingerprints you can use when generating content.",
    icon: Users,
    href: "/creators",
    tips: [
      "Add creators whose style you want to reference",
      "Set trust levels (trusted, mixed, speculative)",
      "The fingerprint tracks their tone, hooks, and structure",
      "You can generate 'in the style of' any saved creator",
    ],
  },
  {
    number: 5,
    title: "Generate Original Content",
    description: "Select source material, pick an output type, and generate content in your voice. 12 output types available.",
    icon: Sparkles,
    href: "/generate",
    tips: [
      "Select one or more source content items",
      "Choose output type: posts, scripts, emails, workshops, etc.",
      "Toggle 'Mesh with my methodology' for your authentic voice",
      "Use the originality slider to control how close to source",
      "Rate outputs with feedback buttons to improve over time",
    ],
  },
  {
    number: 6,
    title: "Use Special Features",
    description: "Green screen scripts, teleprompter mode, daily ideas, content calendar, and trend monitoring.",
    icon: Monitor,
    href: "/ideas/daily",
    tips: [
      "Green screen scripts include beat-by-beat direction and asset suggestions",
      "Teleprompter mode has adjustable speed, font size, and mirror option",
      "Daily Ideas gives you fresh content angles every day",
      "Content Calendar helps plan your publishing schedule",
    ],
  },
];

const OUTPUT_TYPES_GUIDE = [
  { icon: FileText, name: "Facebook Post", description: "Engagement-driven social posts" },
  { icon: FileText, name: "Discussion Post", description: "Conversation-starting posts" },
  { icon: FileText, name: "Email", description: "Email sequences and one-offs" },
  { icon: Video, name: "Talking Head Script", description: "Camera-facing video scripts" },
  { icon: Video, name: "Green Screen Script", description: "Scripts with visual asset direction" },
  { icon: Video, name: "Reel Script", description: "Short-form vertical video scripts" },
  { icon: Lightbulb, name: "Content Idea", description: "Angles and hooks to explore" },
  { icon: FileText, name: "Blog Outline", description: "Structured article outlines" },
  { icon: FileText, name: "Workshop Lesson", description: "Teaching session plans" },
  { icon: FileText, name: "Talking Points", description: "Bullet points for any appearance" },
  { icon: FileText, name: "Book Note", description: "Organized takeaways from reading" },
  { icon: Camera, name: "Carousel Outline", description: "Multi-slide post outlines" },
];

export default function GuidePage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <PageHeader
        title="Getting Started"
        description="Everything you need to know to get the most out of Creator Intelligence Studio"
      />

      {/* Quick Start */}
      <Card className="border-border/50 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-2">Quick Start</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Creator Intelligence Studio is your content brain. Feed it content you consume (YouTube videos, screenshots, articles),
            and it analyzes everything into a searchable library. Then generate original content in YOUR voice, not a generic AI voice.
          </p>
          <div className="flex gap-3">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" /> Set Up Voice First
              </Button>
            </Link>
            <Link href="/inbox">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white" size="sm">
                <Inbox className="h-3 w-3 mr-1" /> Add Your First Content
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Step-by-Step Walkthrough</h2>
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.number} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400">STEP {step.number}</span>
                    </div>
                    <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <ul className="space-y-1.5 mb-4">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={step.href}>
                      <Button variant="outline" size="sm">
                        Go to {step.title.split(" ").slice(-1)[0]} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Output Types */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">What You Can Generate</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OUTPUT_TYPES_GUIDE.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.name} className="border-border/50 bg-card/50 p-4">
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pro Tips */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400" /> Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Add your own past content using 'My Content' in the Inbox — this trains the system to sound like you, not generic AI",
              "Use the Green Screen generator for video content — it includes asset suggestions, gestures, and beat timing",
              "Check Daily Ideas every morning for fresh content angles based on your saved content and trends",
              "Rate generated outputs with feedback buttons — this data will improve future generations",
              "Use the Teleprompter mode when recording — adjustable speed, mirror text, and distraction-free layout",
              "Set status labels on library items (draft → reviewed → favorite → ready to record) to track your content pipeline",
              "Monitor Trends to spot rising topics before they're oversaturated",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Keyboard Shortcuts (Teleprompter)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "Space", action: "Play / Pause" },
              { key: "↑", action: "Increase speed" },
              { key: "↓", action: "Decrease speed" },
              { key: "R", action: "Reset to top" },
              { key: "Esc", action: "Exit teleprompter" },
            ].map((shortcut) => (
              <div key={shortcut.key} className="flex items-center gap-2 text-sm">
                <kbd className="px-2 py-0.5 rounded bg-muted/50 border border-border/50 text-xs font-mono">{shortcut.key}</kbd>
                <span className="text-muted-foreground">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pb-8">
        <Link href="/inbox">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            Start Adding Content <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
