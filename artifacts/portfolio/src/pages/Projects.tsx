import React, { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";

export default function Projects() {
  const { data: projects } = useListProjects();
  const [filter, setFilter] = useState("All");
  const projectsArray = Array.isArray(projects) ? projects : [];

  const categories = ["All", ...Array.from(new Set(projectsArray.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "All" ? projectsArray : projectsArray.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK
        </Link>
        <span className="text-xl font-bold font-mono tracking-widest text-white">WORKS_</span>
        <Link href="/contact" className="text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">CONTACT</Link>
      </nav>

      <main className="pt-32 pb-24 px-8 md:px-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white uppercase mb-4">
            Selected<br /><span className="text-primary">Works</span>
          </h1>
          <p className="text-muted-foreground text-lg font-mono mb-16">A collection of projects I've built and shipped.</p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-xs font-mono tracking-widest uppercase border transition-colors ${filter === cat ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="group flex flex-col border border-white/5 hover:border-primary/30 transition-all duration-300 bg-card/20 hover:bg-card/50"
            >
              <div className="aspect-video relative overflow-hidden bg-card">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-7xl font-black text-primary/20 font-mono">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 left-3 text-xs font-mono bg-primary text-primary-foreground px-2 py-0.5 tracking-widest uppercase">Featured</div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {(project.technologies ?? []).slice(0, 4).map((tech) => (
                    <span key={tech} className="text-xs font-mono text-primary/60 border border-primary/20 px-2 py-0.5">{tech}</span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{project.title}</h2>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed flex-1">{project.description}</p>
                {project.longDescription && (
                  <p className="text-muted-foreground/60 text-xs mt-2 leading-relaxed line-clamp-3">{project.longDescription}</p>
                )}
                <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors">
                      <Github className="w-3.5 h-3.5" /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-primary/70 hover:text-primary transition-colors ml-auto">
                      Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
