import React, { useState } from "react";
import { useListBlogPosts } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export default function Blog() {
  const { data: posts } = useListBlogPosts();
  const published = posts?.filter((p) => p.published);
  const publishedArray = Array.isArray(published) ? published : [];
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(publishedArray.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "All" ? publishedArray : publishedArray.filter((p) => p.category === filter);
  const featured = publishedArray.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK
        </Link>
        <span className="text-xl font-bold font-mono tracking-widest text-white">BLOG_</span>
        <Link href="/contact" className="text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">CONTACT</Link>
      </nav>

      <main className="pt-32 pb-24 px-8 md:px-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white uppercase mb-4">
            Writing<br /><span className="text-primary">& Notes</span>
          </h1>
          <p className="text-muted-foreground text-lg font-mono mb-16">Thoughts on engineering, design, and craft.</p>
        </motion.div>

        {/* Featured Post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`}>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group block mb-16 border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all duration-300 p-8 cursor-pointer"
            >
              <div className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Featured Post</div>
              {featured.category && <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">{featured.category}</div>}
              <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight mb-3">{featured.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                {featured.readTime && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featured.readTime} min read</span>}
                <span>{new Date(featured.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span className="ml-auto text-primary group-hover:text-white transition-colors">Read article →</span>
              </div>
            </motion.article>
          </Link>
        )}

        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap mb-12">
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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.filter((p) => p.id !== featured?.id).map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="group cursor-pointer border border-white/5 hover:border-primary/30 transition-all duration-300 bg-card/20 hover:bg-card/40 p-6"
              >
                {post.coverImageUrl && (
                  <div className="aspect-video overflow-hidden mb-5 -mx-6 -mt-6">
                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                )}
                {post.category && <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">{post.category}</div>}
                <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">{post.title}</h2>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-3">{post.excerpt}</p>
                {(post.tags || []).length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-4">
                    {(post.tags ?? []).slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs font-mono text-muted-foreground/60 flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5 text-xs font-mono text-muted-foreground">
                  {post.readTime && <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{post.readTime} min</span>}
                  <span className="ml-auto">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {publishedArray.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-mono text-sm uppercase tracking-widest">No posts published yet</p>
          </div>
        )}
      </main>
    </div>
  );
}
