import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetHero, useUpdateHero } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

type HeroFormData = {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  ctaPrimary: string;
  ctaSecondary: string;
  avatarUrl: string;
  resumeUrl: string;
};

export default function AdminHero() {
  const { data: hero, isLoading } = useGetHero();
  const { mutate: updateHero, isPending } = useUpdateHero();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<HeroFormData>();

  useEffect(() => {
    if (hero) reset(hero as HeroFormData);
  }, [hero, reset]);

  const onSubmit = (data: HeroFormData) => {
    updateHero({ data }, {
      onSuccess: () => toast({ title: "Hero updated", description: "Changes saved successfully." }),
      onError: () => toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" }),
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight">Hero Section</h1>
        <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Edit the hero banner content</p>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Alex Johnson" />
            </div>
            <div className="space-y-2">
              <Label>Title / Headline</Label>
              <Input {...register("title")} placeholder="Full-Stack Developer" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input {...register("subtitle")} placeholder="Building digital experiences that matter" />
          </div>
          <div className="space-y-2">
            <Label>Bio (short hero description)</Label>
            <Textarea {...register("bio")} rows={3} placeholder="A short bio shown in the hero section..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary CTA Button</Label>
              <Input {...register("ctaPrimary")} placeholder="View Work" />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA Button</Label>
              <Input {...register("ctaSecondary")} placeholder="Contact" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Avatar / Profile Image URL</Label>
            <Input {...register("avatarUrl")} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Resume URL (optional)</Label>
            <Input {...register("resumeUrl")} placeholder="https://..." />
          </div>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </form>
      )}
    </AdminLayout>
  );
}
