import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useListTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type TestimonialFormData = { name: string; role: string; company: string; quote: string; rating: number; sortOrder: number };
type Testimonial = NonNullable<ReturnType<typeof useListTestimonials>["data"]>[0];

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useListTestimonials();
  const { mutate: createT, isPending: isCreating } = useCreateTestimonial();
  const { mutate: updateT, isPending: isUpdating } = useUpdateTestimonial();
  const { mutate: deleteT } = useDeleteTestimonial();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number } | null>(null);
  const { register, handleSubmit, reset } = useForm<TestimonialFormData>({ defaultValues: { rating: 5 } });

  const invalidate = () => qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
  const openCreate = () => { setEditing(null); reset({ name: "", role: "", company: "", quote: "", rating: 5, sortOrder: (testimonials?.length || 0) + 1 }); setOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing({ id: t.id }); reset({ name: t.name, role: t.role, company: t.company, quote: t.quote, rating: t.rating || 5, sortOrder: t.sortOrder }); setOpen(true); };

  const onSubmit = (data: TestimonialFormData) => {
    const payload = { ...data, rating: Number(data.rating), sortOrder: Number(data.sortOrder) };
    if (editing) {
      updateT({ id: editing.id, data: payload }, { onSuccess: () => { toast({ title: "Testimonial updated" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createT({ data: payload }, { onSuccess: () => { toast({ title: "Testimonial created" }); setOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Client reviews and feedback</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Testimonial</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials?.map((t) => (
            <div key={t.id} className="p-5 border border-border rounded-lg bg-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteT({ id: t.id }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } })}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <blockquote className="text-sm text-foreground mt-3 italic leading-relaxed">"{t.quote}"</blockquote>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="font-medium text-sm text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{t.role} · {t.company}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input {...register("name", { required: true })} placeholder="Jane Doe" /></div>
              <div className="space-y-2"><Label>Role</Label><Input {...register("role", { required: true })} placeholder="CTO" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Company</Label><Input {...register("company", { required: true })} placeholder="Acme Inc." /></div>
              <div className="space-y-2"><Label>Rating (1–5)</Label><Input {...register("rating")} type="number" min="1" max="5" /></div>
            </div>
            <div className="space-y-2"><Label>Quote</Label><Textarea {...register("quote", { required: true })} rows={4} placeholder="Their work was exceptional..." /></div>
            <div className="space-y-2"><Label>Sort Order</Label><Input {...register("sortOrder")} type="number" /></div>
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
