"use client";

import { useState } from "react";
import {
  Video,
  Camera,
  FileText,
  User,
  Upload,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TabKey = "youtube" | "screenshot" | "manual" | "my_content";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "youtube", label: "YouTube Link", icon: Video },
  { key: "screenshot", label: "Screenshot Upload", icon: Camera },
  { key: "manual", label: "Manual Text", icon: FileText },
  { key: "my_content", label: "My Content", icon: User },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("youtube");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualText, setManualText] = useState("");
  const [myContentText, setMyContentText] = useState("");
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  const resetForm = () => {
    setYoutubeUrl("");
    setManualTitle("");
    setManualText("");
    setMyContentText("");
    setScreenshotFiles([]);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setProgress(0);
    setSuccess(false);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("tab", activeTab);

      if (activeTab === "youtube") {
        formData.append("url", youtubeUrl);
        formData.append("sourceType", "youtube");
      } else if (activeTab === "screenshot") {
        screenshotFiles.forEach((f) => formData.append("files", f));
        formData.append("sourceType", "screenshot_set");
      } else if (activeTab === "manual") {
        formData.append("title", manualTitle);
        formData.append("rawText", manualText);
        formData.append("sourceType", "manual_text");
      } else {
        formData.append("rawText", myContentText);
        formData.append("sourceType", "user_content");
      }

      await fetch("/api/content/process", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
    } catch {
      clearInterval(progressInterval);
    } finally {
      setProcessing(false);
    }
  };

  const canSubmit = () => {
    if (processing) return false;
    switch (activeTab) {
      case "youtube":
        return youtubeUrl.trim().length > 0;
      case "screenshot":
        return screenshotFiles.length > 0;
      case "manual":
        return manualTitle.trim().length > 0 && manualText.trim().length > 0;
      case "my_content":
        return myContentText.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inbox"
        description="Add new content to your intelligence library"
      />

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                resetForm();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          {activeTab === "youtube" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  YouTube URL
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Paste a YouTube video or Short URL. We will extract the transcript and analyze it.
                </p>
              </div>
            </div>
          )}

          {activeTab === "screenshot" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Screenshots
                </label>
                <div
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-xl hover:border-indigo-500/50 transition-colors cursor-pointer bg-muted/10"
                  onClick={() =>
                    document.getElementById("screenshot-input")?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files).filter((f) =>
                      f.type.startsWith("image/")
                    );
                    setScreenshotFiles((prev) => [...prev, ...files]);
                  }}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">
                    Drop images here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB each. We will OCR the text.
                  </p>
                </div>
                <input
                  id="screenshot-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setScreenshotFiles((prev) => [...prev, ...files]);
                  }}
                />
                {screenshotFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {screenshotFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() =>
                            setScreenshotFiles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="text-xs text-red-400 hover:text-red-300 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "manual" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Content title or source name"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Text
                </label>
                <textarea
                  placeholder="Paste the content text, transcript, notes, or key points..."
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-y"
                />
              </div>
            </div>
          )}

          {activeTab === "my_content" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Content
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Paste your own past posts, frameworks, teaching material, or
                  methodology notes. This becomes part of your voice profile.
                </p>
                <textarea
                  placeholder="Paste your own content here - posts, frameworks, methodology notes, teaching material..."
                  value={myContentText}
                  onChange={(e) => setMyContentText(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-y"
                />
              </div>
            </div>
          )}

          {(processing || success) && (
            <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border/30">
              {processing && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    <span>Processing content...</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Extracting content, analyzing themes, generating summary...
                  </p>
                </div>
              )}
              {success && !processing && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Content processed successfully! View it in your Library.</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white disabled:opacity-40"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Content"
              )}
            </Button>
            {success && (
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Add Another
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
