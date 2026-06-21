import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type BlogFormData = { title: string; slug: string; content: string; excerpt: string; category: string; tags: string; readTime: number; published: boolean; featured: boolean; coverImageUrl: string };
type BlogPost = NonNullable<ReturnType<typeof useListBlogPosts>["data"]>[0];

export default function AdminBlog() {
  const { data: posts, isLoading } = useListBlogPosts();
  const { mutate: createPost, isPending: isCreating } = useCreateBlogPost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdateBlogPost();
  const { mutate: deletePost } = useDeleteBlogPost();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number } | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<BlogFormData>({ defaultValues: { published: false, featured: false } });

  const invalidate = () => qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
  const openCreate = () => { setEditing(null); reset({ title: "", slug: "", content: "", excerpt: "", category: "", tags: "", readTime: 5, published: false, featured: false, coverImageUrl: "" }); setOpen(true); };
  const openEdit = (p: BlogPost) => { setEditing({ id: p.id }); reset({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt, category: p.category || "", tags: (p.tags || []).join(", "), readTime: p.readTime || 5, published: p.published, featured: p.featured, coverImageUrl: p.coverImageUrl || "" }); setOpen(true); };

  const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const onSubmit = (data: BlogFormData) => {
    const payload = { ...data, tags: data.tags.split(",").map(t => t.trim()).filter(Boolean), readTime: Number(data.readTime), published: Boolean(data.published), featured: Boolean(data.featured) };
    if (editing) {
      updatePost({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Post updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createPost({ data: payload }, { onSuccess: () => { toast({ title: "Post created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Blog</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Manage your blog posts</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> New Post</Button>
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
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Read Time</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts?.map((p) => (
                <tr key={p.id} className="hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-mono flex items-center gap-1 ${p.published ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {p.featured && <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-400">Featured</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.readTime ? `${p.readTime} min` : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deletePost({ id: p.id }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } })}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register("title", { required: true })} placeholder="Post title" onChange={(e) => { register("title").onChange(e); if (!editing) setValue("slug", slugify(e.target.value)); }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Slug</Label><Input {...register("slug", { required: true })} placeholder="post-slug" /></div>
              <div className="space-y-2"><Label>Category</Label><Input {...register("category")} placeholder="Engineering, React..." /></div>
            </div>
            <div className="space-y-2"><Label>Excerpt</Label><Textarea {...register("excerpt", { required: true })} rows={2} placeholder="Short description..." /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea {...register("content", { required: true })} rows={10} placeholder="Full post content (Markdown supported)..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input {...register("tags")} placeholder="React, TypeScript" /></div>
              <div className="space-y-2"><Label>Read Time (minutes)</Label><Input {...register("readTime")} type="number" min="1" /></div>
            </div>
            <div className="space-y-2"><Label>Cover Image URL</Label><Input {...register("coverImageUrl")} placeholder="https://..." /></div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" {...register("published")} className="rounded" />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" {...register("featured")} className="rounded" />
                <Label htmlFor="featured">Featured</Label>
              </div>
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
