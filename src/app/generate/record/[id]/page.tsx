"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Monitor, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_SCRIPT = {
  id: "mock-gen-1",
  outputType: "talking_head_script",
  hook: "What if I told you that 90% of businesses are leaving money on the table - not because they don't have a good product, but because their offer is invisible?",
  scenes: [
    {
      label: "THE PROBLEM",
      text: "Most businesses compete on price. They race to the bottom, slashing margins, burning out, and wondering why their 'great product' isn't selling.\n\nHere's the truth nobody wants to hear: Your product isn't the problem. Your offer is.",
      emphasis: ["Your product isn't the problem. Your offer is."],
    },
    {
      label: "THE FRAMEWORK",
      text: "I call it the Value Stack Method, and it comes down to one equation:\n\nValue equals Dream Outcome times Perceived Likelihood, divided by Time Delay times Effort Required.\n\nTo make your offer irresistible, you need to do four things:",
      emphasis: ["Value equals Dream Outcome times Perceived Likelihood, divided by Time Delay times Effort Required."],
    },
    {
      label: "STEP 1 - DREAM OUTCOME",
      text: "Maximize the dream outcome. Make it specific and vivid. Not 'grow your business' but 'add $50K per month in recurring revenue within 90 days.' The more specific, the more believable.",
      emphasis: ["add $50K per month in recurring revenue within 90 days"],
    },
    {
      label: "STEP 2 - LIKELIHOOD",
      text: "Increase perceived likelihood. Stack proof. Testimonials, case studies, guarantees. Remove every shred of doubt. Your prospect needs to feel like success is inevitable.",
      emphasis: ["success is inevitable"],
    },
    {
      label: "STEP 3 - SPEED",
      text: "Minimize time delay. Speed to result matters more than you think. Quick wins build trust and momentum. Give them a win in the first 48 hours.",
      emphasis: ["Give them a win in the first 48 hours"],
    },
    {
      label: "STEP 4 - EFFORT",
      text: "Reduce effort required. Done-for-you beats DIY every single time. Make it easy to say yes. Remove friction at every step.",
      emphasis: ["Done-for-you beats DIY every single time"],
    },
    {
      label: "THE SHIFT",
      text: "Stop selling your coaching program or your marketing service. Start selling the outcome your client desperately wants.\n\nBundle your solutions. Stack the value. Add a guarantee that demonstrates YOUR confidence in YOUR product.",
      emphasis: ["Start selling the outcome your client desperately wants."],
    },
  ],
  cta: "If this framework resonated, drop a comment below with your current offer and I'll tell you the number one thing I'd change to make it irresistible.",
};

export default function RecordViewPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const scriptId = params.id as string;

  const fullText = [
    `HOOK: ${MOCK_SCRIPT.hook}`,
    ...MOCK_SCRIPT.scenes.map((s) => `[${s.label}]\n${s.text}`),
    `CTA: ${MOCK_SCRIPT.cta}`,
  ].join("\n\n---\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderWithEmphasis = (text: string, emphasisList: string[]) => {
    let result = text;
    const parts: { text: string; bold: boolean }[] = [];
    let remaining = result;

    for (const emp of emphasisList) {
      const idx = remaining.indexOf(emp);
      if (idx !== -1) {
        if (idx > 0) parts.push({ text: remaining.slice(0, idx), bold: false });
        parts.push({ text: emp, bold: true });
        remaining = remaining.slice(idx + emp.length);
      }
    }
    if (remaining) parts.push({ text: remaining, bold: false });

    if (parts.length === 0) return <span>{text}</span>;
    return (
      <>
        {parts.map((part, i) =>
          part.bold ? (
            <strong key={i} className="text-indigo-300 font-bold">
              {part.text}
            </strong>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">Record This Now</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              Copy Script
            </Button>
            <Link href={`/generate/teleprompter/${scriptId}`}>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white" size="sm">
                <Monitor className="h-3 w-3 mr-1" />
                Enter Teleprompter Mode
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase mb-6">
            HOOK
          </div>
          <p className="text-3xl font-bold leading-snug tracking-tight">
            {MOCK_SCRIPT.hook}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

        <div className="space-y-16">
          {MOCK_SCRIPT.scenes.map((scene, i) => (
            <div key={i}>
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-4">
                {scene.label}
              </div>
              <div className="text-xl leading-relaxed whitespace-pre-wrap">
                {renderWithEmphasis(scene.text, scene.emphasis)}
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-12" />

        <div className="mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-6">
            CTA
          </div>
          <p className="text-2xl font-semibold leading-relaxed">
            {MOCK_SCRIPT.cta}
          </p>
        </div>
      </div>
    </div>
  );
}
