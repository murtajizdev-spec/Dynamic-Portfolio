import React, { useEffect, Suspense } from "react";
import { useGetHero, useGetAbout, useListSkills, useListProjects, useListExperience } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { ParticleField, HeroShape } from "@/components/Scene";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import Lenis from "lenis";
import { Link } from "wouter";

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
  const webGLSupported = useWebGLSupport();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full relative overflow-hidden bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference flex justify-between items-center">
        <div className="text-xl font-bold font-mono tracking-widest text-white">
          {hero?.name || "SYS.ADMIN"}
        </div>
        <div className="flex gap-6 text-sm font-mono tracking-widest text-white/70">
          <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
          <a href="#projects" className="hover:text-white transition-colors">WORK</a>
          <Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* About Section */}
      <section id="about" className="relative min-h-[70vh] py-24 px-8 md:px-24 bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-64 h-64 md:w-96 md:h-96 relative group"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-500" />
            <img src={about?.profileImageUrl || "/avatar.png"} alt="Profile" className="w-full h-full object-cover rounded-full border border-white/10 relative z-10 grayscale hover:grayscale-0 transition-all duration-500" />
          </motion.div>
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">Initialize<br/><span className="text-primary">About_Me</span></h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              {about?.bio || "A highly specialized entity focused on high-performance interfaces and scalable systems. Operating at the intersection of design and engineering."}
            </p>
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

      {/* Skills Section */}
      <section className="py-24 px-8 md:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-16">
            Tech<br/><span className="text-primary">Stack_</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills?.slice(0, 8).map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 border border-white/10 bg-card/50 hover:border-primary/50 transition-colors group"
              >
                <div className="text-lg font-bold text-white group-hover:text-primary transition-colors">{skill.name}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">{skill.category}</div>
                <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section id="projects" className="py-24 px-8 md:px-24 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">Selected<br/><span className="text-primary">Works</span></h2>
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

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="py-24 px-8 md:px-24 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-16">
              Work<br/><span className="text-primary">History_</span>
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
      
      {/* Footer */}
      <footer className="py-12 px-8 md:px-24 bg-card/30 border-t border-white/5 text-center">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
          SYS.END // {(new Date()).getFullYear()}
        </p>
      </footer>
    </main>
  );
}
