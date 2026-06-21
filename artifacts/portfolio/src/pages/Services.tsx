import React from "react";
import { useListServices, useListTestimonials } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Check, Star } from "lucide-react";
import * as Icons from "lucide-react";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <Icons.Zap className={className} />;
  return <Icon className={className} />;
}

export default function Services() {
  const { data: services } = useListServices();
  const { data: testimonials } = useListTestimonials();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK
        </Link>
        <span className="text-xl font-bold font-mono tracking-widest text-white">SERVICES_</span>
        <Link href="/contact" className="text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">CONTACT</Link>
      </nav>

      <main className="pt-32 pb-24 px-8 md:px-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white uppercase mb-4">
            What I<br /><span className="text-primary">Offer_</span>
          </h1>
          <p className="text-muted-foreground text-lg font-mono mb-20 max-w-2xl">
            Specialized engineering services to help you build, scale, and ship exceptional products.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services?.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 border border-white/10 hover:border-primary/40 bg-card/20 hover:bg-card/40 transition-all duration-300"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="w-12 h-12 border border-primary/30 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 group-hover:border-primary/60 transition-all shrink-0">
                  <DynamicIcon name={service.icon} className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{service.title}</h2>
                  {service.pricing && <div className="text-primary/80 font-mono text-sm mt-1">{service.pricing}</div>}
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
              {(service.features || []).length > 0 && (
                <ul className="space-y-2.5">
                  {(service.features || []).map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16 border border-white/10 bg-card/20 px-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-4">Ready to build something?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Let's discuss your project and figure out how I can help you ship it.</p>
          <Link href="/contact" className="inline-block px-10 py-4 bg-primary text-primary-foreground font-mono tracking-widest text-sm uppercase hover:bg-white hover:text-black transition-colors">
            Start a Conversation →
          </Link>
        </motion.div>

        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-12">
              What Clients<br /><span className="text-primary">Say_</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 border border-white/5 bg-card/20"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-muted-foreground italic leading-relaxed mb-4">"{t.quote}"</blockquote>
                  <div className="pt-4 border-t border-white/5">
                    <div className="font-bold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{t.role} · {t.company}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
