import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListSkillsQueryKey } from "@workspace/api-client-react";

type SkillFormData = { name: string; category: string; level: number; icon: string; sortOrder: number };
type EditTarget = { id: number } & SkillFormData | null;

export default function AdminSkills() {
  const { data: skills, isLoading } = useListSkills();
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const { mutate: deleteSkill } = useDeleteSkill();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EditTarget>(null);
  const { register, handleSubmit, reset } = useForm<SkillFormData>({ defaultValues: { sortOrder: 0, level: 80 } });

  const openCreate = () => { setEditing(null); reset({ name: "", category: "", level: 80, icon: "", sortOrder: (skills?.length || 0) + 1 }); setOpen(true); };
  const openEdit = (s: NonNullable<typeof skills>[0]) => { setEditing({ id: s.id, name: s.name, category: s.category, level: s.level, icon: s.icon || "", sortOrder: s.sortOrder }); reset({ name: s.name, category: s.category, level: s.level, icon: s.icon || "", sortOrder: s.sortOrder }); setOpen(true); };

  const invalidate = () => qc.invalidateQueries({ queryKey: getListSkillsQueryKey() });

  const onSubmit = (data: SkillFormData) => {
    const payload = { ...data, level: Number(data.level), sortOrder: Number(data.sortOrder) };
    if (editing) {
      updateSkill({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Skill updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createSkill({ data: payload }, { onSuccess: () => { toast({ title: "Skill created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  const handleDelete = (id: number) => {
    deleteSkill({ id }, { onSuccess: () => { toast({ title: "Skill deleted" }); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Skills</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Manage your tech stack</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Skill</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Level</th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skills?.map((s) => (
                <tr key={s.id} className="hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${s.level}%` }} />
                      </div>
                      <span className="text-muted-foreground text-xs">{s.level}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Skill" : "Add Skill"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input {...register("name", { required: true })} placeholder="TypeScript" /></div>
              <div className="space-y-2"><Label>Category</Label><Input {...register("category", { required: true })} placeholder="Frontend" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Level (0–100)</Label><Input {...register("level")} type="number" min="0" max="100" /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input {...register("sortOrder")} type="number" /></div>
            </div>
            <div className="space-y-2"><Label>Icon (optional)</Label><Input {...register("icon")} placeholder="SiTypescript" /></div>
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
