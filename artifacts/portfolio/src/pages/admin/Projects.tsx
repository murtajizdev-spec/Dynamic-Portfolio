import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type ProjectFormData = {
  title: string; description: string; longDescription: string; technologies: string;
  category: string; githubUrl: string; liveUrl: string; imageUrl: string;
  featured: boolean; sortOrder: number;
};

type Project = NonNullable<ReturnType<typeof useListProjects>["data"]>[0];

export default function AdminProjects() {
  const { data: projects, isLoading } = useListProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number } | null>(null);
  const { register, handleSubmit, reset } = useForm<ProjectFormData>();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", description: "", longDescription: "", technologies: "", category: "", githubUrl: "", liveUrl: "", imageUrl: "", featured: false, sortOrder: (projects?.length || 0) + 1 });
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing({ id: p.id });
    reset({ title: p.title, description: p.description, longDescription: p.longDescription || "", technologies: p.technologies.join(", "), category: p.category, githubUrl: p.githubUrl || "", liveUrl: p.liveUrl || "", imageUrl: p.imageUrl || "", featured: p.featured, sortOrder: p.sortOrder });
    setOpen(true);
  };

  const onSubmit = (data: ProjectFormData) => {
    const payload = { ...data, technologies: data.technologies.split(",").map(t => t.trim()).filter(Boolean), featured: Boolean(data.featured), sortOrder: Number(data.sortOrder) };
    if (editing) {
      updateProject({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Project updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createProject({ data: payload }, { onSuccess: () => { toast({ title: "Project created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Projects</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Manage your portfolio projects</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Project</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Featured</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Links</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects?.map((p) => (
                <tr key={p.id} className="hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${p.featured ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.featured ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground"><Github className="w-4 h-4" /></a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground"><ExternalLink className="w-4 h-4" /></a>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteProject({ id: p.id }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } })}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input {...register("title", { required: true })} placeholder="Project name" /></div>
            <div className="space-y-2"><Label>Short Description</Label><Textarea {...register("description", { required: true })} rows={2} placeholder="One-line description..." /></div>
            <div className="space-y-2"><Label>Long Description (optional)</Label><Textarea {...register("longDescription")} rows={4} placeholder="Full project details..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Category</Label><Input {...register("category", { required: true })} placeholder="SaaS, Open Source..." /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input {...register("sortOrder")} type="number" /></div>
            </div>
            <div className="space-y-2"><Label>Technologies (comma-separated)</Label><Input {...register("technologies")} placeholder="React, Node.js, PostgreSQL" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>GitHub URL</Label><Input {...register("githubUrl")} placeholder="https://github.com/..." /></div>
              <div className="space-y-2"><Label>Live URL</Label><Input {...register("liveUrl")} placeholder="https://..." /></div>
            </div>
            <div className="space-y-2"><Label>Image URL</Label><Input {...register("imageUrl")} placeholder="https://..." /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" {...register("featured")} className="rounded" />
              <Label htmlFor="featured">Featured project</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating} className="gap-2">
                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
