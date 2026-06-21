import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

type SettingsFormData = {
  siteName: string; siteTagline: string; siteDescription: string;
  githubUrl: string; linkedinUrl: string; twitterUrl: string; email: string;
  accentColor: string; footerText: string;
};

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<SettingsFormData>();

  useEffect(() => {
    if (settings) reset(settings as unknown as SettingsFormData);
  }, [settings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    updateSettings({ data }, {
      onSuccess: () => toast({ title: "Settings updated", description: "Changes saved successfully." }),
      onError: () => toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" }),
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight">Settings</h1>
        <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Global site configuration</p>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground border-b border-border pb-2">Site Info</h2>
            <div className="space-y-2"><Label>Site Name</Label><Input {...register("siteName")} placeholder="My Portfolio" /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input {...register("siteTagline")} placeholder="Building digital experiences that matter" /></div>
            <div className="space-y-2"><Label>Meta Description</Label><Textarea {...register("siteDescription")} rows={3} placeholder="SEO description for your portfolio..." /></div>
            <div className="space-y-2"><Label>Footer Text</Label><Input {...register("footerText")} placeholder="© 2025 Your Name. All rights reserved." /></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground border-b border-border pb-2">Social Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>GitHub URL</Label><Input {...register("githubUrl")} placeholder="https://github.com/username" /></div>
              <div className="space-y-2"><Label>LinkedIn URL</Label><Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/username" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Twitter / X URL</Label><Input {...register("twitterUrl")} placeholder="https://twitter.com/username" /></div>
              <div className="space-y-2"><Label>Contact Email</Label><Input {...register("email")} type="email" placeholder="hello@example.com" /></div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground border-b border-border pb-2">Appearance</h2>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center gap-3">
                <Input {...register("accentColor")} placeholder="#00f0ff" className="flex-1" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </Button>
        </form>
      )}
    </AdminLayout>
  );
}
