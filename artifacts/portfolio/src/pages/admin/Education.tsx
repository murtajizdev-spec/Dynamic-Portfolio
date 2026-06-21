import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListEducation, useCreateEducation, useUpdateEducation, useDeleteEducation, getListEducationQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type EduFormData = { institution: string; degree: string; field: string; startYear: number; endYear: number; description: string; sortOrder: number };
type Edu = NonNullable<ReturnType<typeof useListEducation>["data"]>[0];

export default function AdminEducation() {
  const { data: education, isLoading } = useListEducation();
  const { mutate: createEdu, isPending: isCreating } = useCreateEducation();
  const { mutate: updateEdu, isPending: isUpdating } = useUpdateEducation();
  const { mutate: deleteEdu } = useDeleteEducation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number } | null>(null);
  const { register, handleSubmit, reset } = useForm<EduFormData>();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListEducationQueryKey() });
  const openCreate = () => { setEditing(null); reset({ institution: "", degree: "", field: "", startYear: 2020, endYear: 2024, description: "", sortOrder: (education?.length || 0) + 1 }); setOpen(true); };
  const openEdit = (e: Edu) => { setEditing({ id: e.id }); reset({ institution: e.institution, degree: e.degree, field: e.field, startYear: e.startYear, endYear: e.endYear || 0, description: e.description || "", sortOrder: e.sortOrder }); setOpen(true); };

  const onSubmit = (data: EduFormData) => {
    const payload = { ...data, startYear: Number(data.startYear), endYear: Number(data.endYear), sortOrder: Number(data.sortOrder) };
    if (editing) {
      updateEdu({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Education updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createEdu({ data: payload }, { onSuccess: () => { toast({ title: "Education created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Education</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Academic background</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Education</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <div className="space-y-4">
          {education?.map((e) => (
            <div key={e.id} className="p-5 border border-border rounded-lg bg-card flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{e.institution}</h3>
                <div className="text-primary font-mono text-sm mt-0.5">{e.degree} — {e.field}</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">{e.startYear} — {e.endYear || "Present"}</div>
                {e.description && <p className="text-sm text-muted-foreground mt-2">{e.description}</p>}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(e)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteEdu({ id: e.id }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } })}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Education" : "Add Education"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2"><Label>Institution</Label><Input {...register("institution", { required: true })} placeholder="MIT" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Degree</Label><Input {...register("degree", { required: true })} placeholder="Bachelor of Science" /></div>
              <div className="space-y-2"><Label>Field of Study</Label><Input {...register("field", { required: true })} placeholder="Computer Science" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Start Year</Label><Input {...register("startYear")} type="number" /></div>
              <div className="space-y-2"><Label>End Year</Label><Input {...register("endYear")} type="number" /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input {...register("sortOrder")} type="number" /></div>
            </div>
            <div className="space-y-2"><Label>Description (optional)</Label><Textarea {...register("description")} rows={3} /></div>
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
