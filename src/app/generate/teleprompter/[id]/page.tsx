"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Minus,
  Plus,
  FlipHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_SCRIPT_TEXT = `What if I told you that 90% of businesses are leaving money on the table - not because they don't have a good product, but because their offer is invisible?

---

Most businesses compete on price. They race to the bottom, slashing margins, burning out, and wondering why their "great product" isn't selling.

Here's the truth nobody wants to hear: Your product isn't the problem. Your offer is.

---

I call it the Value Stack Method, and it comes down to one equation:

Value equals Dream Outcome times Perceived Likelihood, divided by Time Delay times Effort Required.

To make your offer irresistible, you need to do four things:

---

First - maximize the dream outcome. Make it specific and vivid. Not "grow your business" but "add $50K per month in recurring revenue within 90 days." The more specific, the more believable.

---

Second - increase perceived likelihood. Stack proof. Testimonials, case studies, guarantees. Remove every shred of doubt. Your prospect needs to feel like success is inevitable.

---

Third - minimize time delay. Speed to result matters more than you think. Quick wins build trust and momentum. Give them a win in the first 48 hours.

---

Fourth - reduce effort required. Done-for-you beats DIY every single time. Make it easy to say yes. Remove friction at every step.

---

Stop selling your coaching program or your marketing service. Start selling the outcome your client desperately wants.

Bundle your solutions. Stack the value. Add a guarantee that demonstrates YOUR confidence in YOUR product.

---

If this framework resonated, drop a comment below with your current offer and I'll tell you the number one thing I'd change to make it irresistible.`;

export default function TeleprompterPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const [fontSize, setFontSize] = useState(32);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const scrollStep = useCallback(() => {
    if (!scrollRef.current) return;
    const now = performance.now();
    if (lastTimestampRef.current !== null) {
      const delta = now - lastTimestampRef.current;
      const pixelsPerFrame = (scrollSpeed / 100) * (delta / 16);
      scrollRef.current.scrollTop += pixelsPerFrame;
    }
    lastTimestampRef.current = now;
    animationRef.current = requestAnimationFrame(scrollStep);
  }, [scrollSpeed]);

  useEffect(() => {
    if (isPlaying) {
      lastTimestampRef.current = null;
      animationRef.current = requestAnimationFrame(scrollStep);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, scrollStep]);

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    } else if (e.code === "Escape") {
      router.back();
    } else if (e.code === "KeyR") {
      handleReset();
    } else if (e.code === "ArrowUp") {
      setScrollSpeed((prev) => Math.min(prev + 10, 200));
    } else if (e.code === "ArrowDown") {
      setScrollSpeed((prev) => Math.max(prev - 10, 10));
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-3">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium text-white/60">
                Teleprompter Mode
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Font</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setFontSize((s) => Math.max(s - 4, 16))}
                  className="text-white hover:bg-white/10"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs w-8 text-center">{fontSize}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setFontSize((s) => Math.min(s + 4, 72))}
                  className="text-white hover:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Speed</span>
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                  className="w-24 h-1 rounded-full appearance-none cursor-pointer bg-white/20 accent-indigo-500"
                />
                <span className="text-xs w-8 text-center">{scrollSpeed}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/10"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMirrored(!isMirrored)}
                  className={`text-white hover:bg-white/10 ${isMirrored ? "bg-white/10" : ""}`}
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-20"
        style={{
          transform: isMirrored ? "scaleX(-1)" : "none",
        }}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <div className="max-w-4xl mx-auto px-12 py-[40vh]">
          <div
            className="whitespace-pre-wrap leading-[1.6] font-medium text-center"
            style={{ fontSize: `${fontSize}px` }}
          >
            {MOCK_SCRIPT_TEXT.split("---").map((section, i) => (
              <div key={i} className={i > 0 ? "mt-12" : ""}>
                {section.trim()}
              </div>
            ))}
          </div>
          <div className="h-[60vh]" />
        </div>
      </div>

      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 text-xs text-white/40">
          <span>SPACE play/pause</span>
          <span className="text-white/20">|</span>
          <span>ARROWS speed</span>
          <span className="text-white/20">|</span>
          <span>R reset</span>
          <span className="text-white/20">|</span>
          <span>ESC exit</span>
        </div>
      </div>
    </div>
  );
}
