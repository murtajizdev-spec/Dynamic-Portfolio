import React, { useEffect, Suspense } from "react";
import {
  useGetHero,
  useGetAbout,
  useListSkills,
  useListProjects,
  useListExperience,
  useListTestimonials,
  useListEducation,
  useListServices,
} from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { ParticleField, HeroShape } from "@/components/Scene";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import Lenis from "lenis";
import { Link } from "wouter";
import { Star, GraduationCap, Code2, Cpu, Sparkles, Rocket, CheckCircle2, ExternalLink } from "lucide-react";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Code2, Cpu, Sparkles, Rocket,
};

function CSSParticleFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.2 + Math.random() * 0.6,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

function ThreeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <ParticleField />
      <HeroShape />
    </Canvas>
  );
}

export default function Home() {
  const { data: hero } = useGetHero();
  const { data: about } = useGetAbout();
  const { data: skills } = useListSkills();
  const { data: projects } = useListProjects();
  const { data: experience } = useListExperience();
  const { data: testimonials } = useListTestimonials();
  const { data: education } = useListEducation();
  const { data: services } = useListServices();
  const webGLSupported = useWebGLSupport();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <main className="w-full relative overflow-hidden bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference flex justify-between items-center">
        <div className="text-xl font-bold font-mono tracking-widest text-white">
          {hero?.name || "SYS.PORT"}
        </div>
        <div className="flex gap-6 text-sm font-mono tracking-widest text-white/70">
          <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
          <a href="#projects" className="hover:text-white transition-colors">WORK</a>
          <Link href="/services" className="hover:text-white transition-colors">SERVICES</Link>
          <Link href="/blog" className="hover:text-white transition-colors">BLOG</Link>
          <Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-[100svh] flex flex-col justify-center px-8 md:px-24">
        <div className="absolute inset-0 z-0">
          {webGLSupported ? (
            <Suspense fallback={<CSSParticleFallback />}>
              <ThreeCanvas />
            </Suspense>
          ) : (
            <CSSParticleFallback />
          )}
          <div className="absolute inset-0 bg-background/50 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter text-white leading-none uppercase">
              {hero?.title || "DEVELOPER"}
            </h1>
            <p className="text-xl md:text-2xl text-primary mt-6 font-mono tracking-widest uppercase">
              {hero?.subtitle || "Creating digital experiences"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex gap-4"
          >
            <a href="#projects" className="px-8 py-4 bg-primary text-primary-foreground font-mono tracking-widest text-sm uppercase hover:bg-white hover:text-black transition-colors">
              {hero?.ctaPrimary || "View Work"}
            </a>
            <Link href="/contact" className="px-8 py-4 border border-white/20 text-white font-mono tracking-widest text-sm uppercase hover:bg-white/10 transition-colors">
              {hero?.ctaSecondary || "Contact"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="relative min-h-[70vh] py-24 px-8 md:px-24 bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-64 h-64 md:w-96 md:h-96 relative group shrink-0"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-500" />
            <img
              src={about?.profileImageUrl || "/avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border border-white/10 relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>

          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
              Initialize<br /><span className="text-primary">About_Me</span>
            </h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              {about?.bio || "A highly specialized entity focused on high-performance interfaces and scalable systems."}
            </p>
            {about?.location && (
              <p className="text-sm font-mono text-primary/70 uppercase tracking-widest">
                📍 {about.location}
              </p>
            )}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{about?.yearsExperience || 0}+</div>
                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Years Exp</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">{about?.projectsCompleted || 0}+</div>
                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">{about?.happyClients || 0}</div>
                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="py-24 px-8 md:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-16">
            Tech<br /><span className="text-primary">Stack_</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills?.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="p-6 border border-white/10 bg-card/50 hover:border-primary/50 transition-colors group"
              >
                <div className="text-lg font-bold text-white group-hover:text-primary transition-colors">{skill.name}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">{skill.category}</div>
                <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-24 px-8 md:px-24 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
              Selected<br /><span className="text-primary">Works</span>
            </h2>
            <Link href="/projects" className="text-primary font-mono tracking-widest text-sm hover:text-white transition-colors">
              VIEW ALL_ //
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects?.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-video bg-card/50 overflow-hidden mb-4 border border-white/5 relative">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <div className="text-6xl font-black text-primary/20 font-mono">{String(i + 1).padStart(2, "0")}</div>
                    </div>
                  )}
                  {(project.liveUrl || project.githubUrl) && (
                    <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 bg-background/80 border border-white/20 text-white hover:bg-primary hover:border-primary transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs font-mono text-primary/70 border border-primary/20 px-2 py-0.5">{tech}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{project.title}</h3>
                <p className="text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      {services && services.length > 0 && (
        <section id="services" className="py-24 px-8 md:px-24 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
                What I<br /><span className="text-primary">Offer_</span>
              </h2>
              <Link href="/services" className="text-primary font-mono tracking-widest text-sm hover:text-white transition-colors">
                VIEW ALL_ //
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, i) => {
                const Icon = SERVICE_ICONS[service.icon || ""] || Code2;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 border border-white/10 bg-card/30 hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 border border-primary/30 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      {service.pricing && (
                        <span className="text-xs font-mono text-primary uppercase tracking-widest border border-primary/20 px-3 py-1">
                          {service.pricing}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-5">{service.description}</p>
                    {(service.features ?? []).length > 0 && (
                      <ul className="space-y-2">
                        {(service.features ?? []).slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Experience ── */}
      {experience && experience.length > 0 && (
        <section className="py-24 px-8 md:px-24 bg-card/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-16">
              Work<br /><span className="text-primary">History_</span>
            </h2>
            <div className="space-y-12 border-l border-white/10 pl-8">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-[37px] w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">
                    {exp.startDate?.slice(0, 4)} — {exp.current ? "Present" : exp.endDate?.slice(0, 4)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{exp.position}</h3>
                  <div className="text-primary font-mono tracking-wide mb-3">{exp.company}</div>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Education ── */}
      {education && education.length > 0 && (
        <section className="py-24 px-8 md:px-24 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-16">
              Edu<br /><span className="text-primary">cation_</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-white/10 bg-card/30 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 border border-primary/30 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-mono text-primary/70 uppercase tracking-widest">
                      {edu.startYear} — {edu.endYear ?? "Present"}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">{edu.degree}</h3>
                  <div className="text-primary font-mono tracking-wide text-sm mt-1 mb-1">{edu.field}</div>
                  <div className="text-muted-foreground text-sm font-mono mb-4">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 px-8 md:px-24 bg-card/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-16">
              Client<br /><span className="text-primary">Words_</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-white/10 bg-card/30 hover:border-primary/30 transition-colors flex flex-col gap-6"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating ?? 5 }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {t.role}{t.company ? `, ${t.company}` : ""}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-32 px-8 md:px-24 bg-background text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter uppercase mb-6">
              Let&apos;s Build<br /><span className="text-primary">Together_</span>
            </h2>
            <p className="text-muted-foreground text-xl mb-12">
              Have a project in mind? I&apos;d love to hear about it.
            </p>
            <Link href="/contact" className="inline-block px-12 py-5 bg-primary text-primary-foreground font-mono tracking-widest text-sm uppercase hover:bg-white hover:text-black transition-colors">
              GET IN TOUCH_
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-8 md:px-24 bg-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
            {hero?.name || "SYS.PORT"} // {new Date().getFullYear()}
          </p>
          <div className="flex gap-6 text-xs font-mono text-muted-foreground">
            <Link href="/projects" className="hover:text-white transition-colors uppercase tracking-widest">Work</Link>
            <Link href="/services" className="hover:text-white transition-colors uppercase tracking-widest">Services</Link>
            <Link href="/blog" className="hover:text-white transition-colors uppercase tracking-widest">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors uppercase tracking-widest">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
