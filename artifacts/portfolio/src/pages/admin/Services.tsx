import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListServices, useCreateService, useUpdateService, useDeleteService, getListServicesQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type ServiceFormData = { icon: string; title: string; description: string; pricing: string; features: string; sortOrder: number };
type Service = NonNullable<ReturnType<typeof useListServices>["data"]>[0];

export default function AdminServices() {
  const { data: services, isLoading } = useListServices();
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
  const { mutate: deleteService } = useDeleteService();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number } | null>(null);
  const { register, handleSubmit, reset } = useForm<ServiceFormData>();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() });

  const openCreate = () => { setEditing(null); reset({ icon: "", title: "", description: "", pricing: "", features: "", sortOrder: (services?.length || 0) + 1 }); setOpen(true); };
  const openEdit = (s: Service) => { setEditing({ id: s.id }); reset({ icon: s.icon, title: s.title, description: s.description, pricing: s.pricing || "", features: (s.features || []).join("\n"), sortOrder: s.sortOrder }); setOpen(true); };

  const onSubmit = (data: ServiceFormData) => {
    const payload = { ...data, features: data.features.split("\n").map(f => f.trim()).filter(Boolean), sortOrder: Number(data.sortOrder) };
    if (editing) {
      updateService({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Service updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createService({ data: payload }, { onSuccess: () => { toast({ title: "Service created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Services</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Manage your service offerings</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Service</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services?.map((s) => (
            <div key={s.id} className="p-5 border border-border rounded-lg bg-card hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs font-mono text-primary uppercase tracking-widest mb-1">{s.icon}</div>
                  <h3 className="font-bold text-foreground">{s.title}</h3>
                  {s.pricing && <div className="text-sm text-primary mt-1">{s.pricing}</div>}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteService({ id: s.id }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } })}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              {(s.features || []).length > 0 && (
                <ul className="mt-3 space-y-1">
                  {(s.features || []).slice(0, 3).map((f, i) => <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-full" />{f}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Icon (Lucide name)</Label><Input {...register("icon", { required: true })} placeholder="Code2" /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input {...register("sortOrder")} type="number" /></div>
            </div>
            <div className="space-y-2"><Label>Title</Label><Input {...register("title", { required: true })} placeholder="Service name" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea {...register("description", { required: true })} rows={3} /></div>
            <div className="space-y-2"><Label>Pricing (optional)</Label><Input {...register("pricing")} placeholder="From $2,500" /></div>
            <div className="space-y-2"><Label>Features (one per line)</Label><Textarea {...register("features")} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" /></div>
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
