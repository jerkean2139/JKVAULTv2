"use client";

import { useState } from "react";
import {
  FolderKanban,
  Plus,
  X,
  Edit3,
  FileText,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COLOR_OPTIONS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

interface Project {
  id: string;
  name: string;
  color: string;
  description: string;
  contentCount: number;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Offer Design",
    color: "#6366f1",
    description: "Frameworks and strategies for creating irresistible offers",
    contentCount: 12,
  },
  {
    id: "2",
    name: "Content Engine",
    color: "#a855f7",
    description: "Building a systematic content creation and repurposing pipeline",
    contentCount: 8,
  },
  {
    id: "3",
    name: "Business Models",
    color: "#f43f5e",
    description: "Exploring different business model frameworks and case studies",
    contentCount: 5,
  },
  {
    id: "4",
    name: "Scaling Playbook",
    color: "#10b981",
    description: "Strategies for scaling operations, team, and revenue",
    contentCount: 9,
  },
  {
    id: "5",
    name: "Email Mastery",
    color: "#f59e0b",
    description: "Email marketing sequences, templates, and conversion strategies",
    contentCount: 4,
  },
  {
    id: "6",
    name: "Team Building",
    color: "#0ea5e9",
    description: "Leadership, hiring, culture, and remote team management",
    contentCount: 3,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", color: "#6366f1", description: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setProjects((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: form.name,
        color: form.color,
        description: form.description,
        contentCount: 0,
      },
    ]);
    setForm({ name: "", color: "#6366f1", description: "" });
    setShowAddDialog(false);
  };

  const handleEditSave = () => {
    if (!form.name.trim() || !editingId) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? { ...p, name: form.name, color: form.color, description: form.description }
          : p
      )
    );
    setEditingId(null);
    setForm({ name: "", color: "#6366f1", description: "" });
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({ name: project.name, color: project.color, description: project.description });
  };

  const inputClasses =
    "w-full h-10 px-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50";

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Organize your content into focused projects">
        <Button
          onClick={() => {
            setForm({ name: "", color: "#6366f1", description: "" });
            setShowAddDialog(true);
          }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Project
        </Button>
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create projects to organize your content by topic or campaign."
          actionLabel="Create Project"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all group"
            >
              <CardContent className="pt-5">
                {editingId === project.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className={inputClasses}
                      placeholder="Project name"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            form.color === c.value ? "border-white scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Description"
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        <h3 className="text-sm font-semibold">{project.name}</h3>
                      </div>
                      <button
                        onClick={() => startEdit(project)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {project.contentCount} content items
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">New Project</h2>
              <button onClick={() => setShowAddDialog(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Project name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        form.color === c.value ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  placeholder="What is this project about?"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!form.name.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
