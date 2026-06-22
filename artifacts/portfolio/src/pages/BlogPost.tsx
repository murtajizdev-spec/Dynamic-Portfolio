import React from "react";
import { useParams, Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, isLoading } = useListBlogPosts();

  const post = posts?.find((p) => p.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-mono text-sm tracking-widest animate-pulse">LOADING_</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-8">
        <div className="text-8xl font-black text-primary/20 font-mono">404</div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Post Not Found</h1>
        <Link href="/blog" className="text-primary font-mono text-sm hover:text-white transition-colors">← Back to Blog</Link>
      </div>
    );
  }

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <Link href="/blog" className="flex items-center gap-2 text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BLOG
        </Link>
        <Link href="/" className="text-xl font-bold font-mono tracking-widest text-white">SYS.PORT</Link>
        <Link href="/contact" className="text-sm font-mono tracking-widest text-white/70 hover:text-white transition-colors">CONTACT</Link>
      </nav>

      <main className="pt-32 pb-24 px-8 md:px-24 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {post.coverImageUrl && (
            <div className="aspect-video overflow-hidden mb-12 border border-white/5">
              <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {post.category && (
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-4">{post.category}</div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground pb-8 mb-12 border-b border-white/10 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} min read
              </span>
            )}
            {(post.tags || []).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                <Tag className="w-3.5 h-3.5" />
                {(post.tags ?? []).map((tag) => (
                  <span key={tag} className="text-primary/70">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 italic border-l-2 border-primary/30 pl-6">{post.excerpt}</p>
            {paragraphs.map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i} className="text-2xl font-bold text-white uppercase tracking-tight mt-12 mb-4 pt-4">{para.slice(3)}</h2>;
              }
              if (para.startsWith("# ")) {
                return <h1 key={i} className="text-3xl font-bold text-white uppercase tracking-tighter mt-12 mb-4 pt-4">{para.slice(2)}</h1>;
              }
              if (para.startsWith("### ")) {
                return <h3 key={i} className="text-xl font-bold text-white uppercase tracking-tight mt-8 mb-3">{para.slice(4)}</h3>;
              }
              return <p key={i} className="text-muted-foreground leading-relaxed mb-6 text-lg">{para}</p>;
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <Link href="/blog" className="flex items-center gap-2 text-sm font-mono text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <Link href="/contact" className="text-sm font-mono text-primary hover:text-white transition-colors">
              Get in Touch →
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
