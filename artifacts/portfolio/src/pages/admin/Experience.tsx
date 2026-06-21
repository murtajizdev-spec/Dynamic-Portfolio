import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListExperience, useCreateExperience, useUpdateExperience, useDeleteExperience, getListExperienceQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type ExpFormData = { company: string; position: string; startDate: string; endDate: string; description: string; current: boolean; companyUrl: string; sortOrder: number };
type Exp = NonNullable<ReturnType<typeof useListExperience>["data"]>[0];

export default function AdminExperience() {
  const { data: experience, isLoading } = useListExperience();
  const { mutate: createExp, isPending: isCreating } = useCreateExperience();
  const { mutate: updateExp, isPending: isUpdating } = useUpdateExperience();
  const { mutate: deleteExp } = useDeleteExperience();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number } | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<ExpFormData>();
  const isCurrent = watch("current");

  const invalidate = () => qc.invalidateQueries({ queryKey: getListExperienceQueryKey() });

  const openCreate = () => { setEditing(null); reset({ company: "", position: "", startDate: "", endDate: "", description: "", current: false, companyUrl: "", sortOrder: (experience?.length || 0) + 1 }); setOpen(true); };
  const openEdit = (e: Exp) => { setEditing({ id: e.id }); reset({ company: e.company, position: e.position, startDate: e.startDate?.slice(0, 10) || "", endDate: e.endDate?.slice(0, 10) || "", description: e.description, current: e.current, companyUrl: e.companyUrl || "", sortOrder: e.sortOrder }); setOpen(true); };

  const onSubmit = (data: ExpFormData) => {
    const payload = { ...data, current: Boolean(data.current), sortOrder: Number(data.sortOrder), endDate: data.current ? undefined : data.endDate || undefined };
    if (editing) {
      updateExp({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Experience updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createExp({ data: payload }, { onSuccess: () => { toast({ title: "Experience created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Experience</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Your work history</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Role</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <div className="space-y-4">
          {experience?.map((e) => (
            <div key={e.id} className="p-5 border border-border rounded-lg bg-card flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-foreground">{e.position}</h3>
                  {e.current && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">CURRENT</span>}
                </div>
                <div className="text-primary font-mono text-sm mt-0.5">{e.company}</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {e.startDate?.slice(0, 7)} — {e.current ? "Present" : e.endDate?.slice(0, 7)}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(e)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteExp({ id: e.id }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } })}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Experience" : "Add Experience"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Company</Label><Input {...register("company", { required: true })} placeholder="Stripe" /></div>
              <div className="space-y-2"><Label>Position</Label><Input {...register("position", { required: true })} placeholder="Senior Engineer" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input {...register("startDate", { required: true })} type="date" /></div>
              <div className="space-y-2"><Label>End Date</Label><Input {...register("endDate")} type="date" disabled={isCurrent} /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="current" {...register("current")} className="rounded" />
              <Label htmlFor="current">Current role</Label>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea {...register("description", { required: true })} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Company URL</Label><Input {...register("companyUrl")} placeholder="https://..." /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input {...register("sortOrder")} type="number" /></div>
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
