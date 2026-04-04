"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FolderKanban,
  Plus,
  X,
  Edit3,
  FileText,
  Save,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", color: "#6366f1", description: "" });
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          color: p.color || "#6366f1",
          description: p.description || "",
          contentCount: p._count?.contentItems ?? 0,
        }));
        setProjects(mapped);
      } catch {
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setAddingProject(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setProjects((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.name,
            color: created.color || form.color,
            description: created.description || form.description,
            contentCount: 0,
          },
        ]);
        toast.success("Project created", { description: form.name });
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error("Failed to create project", { description: err.error || "Please try again" });
      }
    } catch {
      toast.error("Failed to create project");
    } finally {
      setAddingProject(false);
      setForm({ name: "", color: "#6366f1", description: "" });
      setShowAddDialog(false);
    }
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

  const handleDelete = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        toast.success("Project deleted", { description: project.name });
      } else {
        toast.error("Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    }
    setDeleteTarget(null);
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

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-5 h-[140px] animate-pulse">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-muted/50" />
                  <div className="h-4 w-24 rounded bg-muted/50" />
                </div>
                <div className="h-3 w-full rounded bg-muted/30 mb-3" />
                <div className="h-3 w-2/3 rounded bg-muted/30 mb-3" />
                <div className="h-3 w-20 rounded bg-muted/30" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
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
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(project)} aria-label="Edit project">
                          <Edit3 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button onClick={() => setDeleteTarget(project)} aria-label="Delete project">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-400" />
                        </button>
                      </div>
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
                  disabled={!form.name.trim() || addingProject}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  {addingProject ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Content items in this project won't be deleted, but they'll be unassigned.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
