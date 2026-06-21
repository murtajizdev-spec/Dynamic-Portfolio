import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSendContactMessage, useGetAbout, useGetSettings } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Loader2, Send, Mail, MapPin, Github, Linkedin, Twitter, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ContactFormData = { name: string; email: string; subject: string; message: string };

export default function Contact() {
  const { data: about } = useGetAbout();
  const { data: settings } = useGetSettings();
  const { mutate: sendMessage, isPending } = useSendContactMessage();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    sendMessage({ data }, {
      onSuccess: () => { setSent(true); reset(); },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK
        </Link>
        <span className="text-xl font-bold font-mono tracking-widest text-white">CONTACT_</span>
        <Link href="/projects" className="text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">WORK</Link>
      </nav>

      <main className="pt-32 pb-24 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-none mb-6">
              Let's<br /><span className="text-primary">Work_</span><br />Together
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md">
              Have a project in mind? Looking for a collaborator? Or just want to say hi? I'd love to hear from you.
            </p>

            <div className="space-y-6">
              {about?.email && (
                <a href={`mailto:${about.email}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Email</div>
                    <div className="text-white group-hover:text-primary transition-colors">{about.email}</div>
                  </div>
                </a>
              )}
              {about?.location && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Location</div>
                    <div className="text-white">{about.location}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-12">
              {settings?.githubUrl && (
                <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary text-muted-foreground transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary text-muted-foreground transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary text-muted-foreground transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-16">
                <CheckCircle2 className="w-16 h-16 text-primary" />
                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Message Sent!</h2>
                <p className="text-muted-foreground max-w-sm">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                <button onClick={() => setSent(false)} className="text-primary font-mono text-sm hover:text-white transition-colors mt-4">Send another →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Name *</Label>
                    <Input
                      {...register("name", { required: true })}
                      placeholder="Your name"
                      className={`bg-card/50 border-white/10 focus:border-primary/50 ${errors.name ? "border-destructive" : ""}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email *</Label>
                    <Input
                      {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                      type="email"
                      placeholder="you@example.com"
                      className={`bg-card/50 border-white/10 focus:border-primary/50 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Subject *</Label>
                  <Input
                    {...register("subject", { required: true })}
                    placeholder="What's this about?"
                    className={`bg-card/50 border-white/10 focus:border-primary/50 ${errors.subject ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Message *</Label>
                  <Textarea
                    {...register("message", { required: true, minLength: 20 })}
                    rows={7}
                    placeholder="Tell me about your project, idea, or question..."
                    className={`bg-card/50 border-white/10 focus:border-primary/50 resize-none ${errors.message ? "border-destructive" : ""}`}
                  />
                </div>
                <Button type="submit" disabled={isPending} className="w-full gap-3 h-14 text-base font-mono tracking-widest uppercase">
                  {isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Send Message</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
