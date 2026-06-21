import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetAbout, useUpdateAbout } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

type AboutFormData = {
  bio: string;
  profileImageUrl: string;
  location: string;
  email: string;
  phone: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
};

export default function AdminAbout() {
  const { data: about, isLoading } = useGetAbout();
  const { mutate: updateAbout, isPending } = useUpdateAbout();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<AboutFormData>();

  useEffect(() => {
    if (about) reset(about as unknown as AboutFormData);
  }, [about, reset]);

  const onSubmit = (data: AboutFormData) => {
    updateAbout({
      data: {
        ...data,
        yearsExperience: Number(data.yearsExperience),
        projectsCompleted: Number(data.projectsCompleted),
        happyClients: Number(data.happyClients),
      }
    }, {
      onSuccess: () => toast({ title: "About updated", description: "Changes saved successfully." }),
      onError: () => toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" }),
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight">About Section</h1>
        <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Edit your personal info and stats</p>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea {...register("bio")} rows={5} placeholder="Tell visitors about yourself..." />
          </div>
          <div className="space-y-2">
            <Label>Profile Image URL</Label>
            <Input {...register("profileImageUrl")} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input {...register("location")} placeholder="San Francisco, CA" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register("email")} type="email" placeholder="hello@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone (optional)</Label>
            <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Years Experience</Label>
              <Input {...register("yearsExperience")} type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Projects Completed</Label>
              <Input {...register("projectsCompleted")} type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Happy Clients</Label>
              <Input {...register("happyClients")} type="number" min="0" />
            </div>
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
