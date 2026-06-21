import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, Users, FolderOpen, Briefcase, FileText, Settings, LogOut, Mail, GraduationCap, Star, BookOpen, Layers } from 'lucide-react';
import { Link } from 'wouter';

const navItems = [
  { href: '/admin', label: 'Overview', icon: Home },
  { href: '/admin/hero', label: 'Hero', icon: Layers },
  { href: '/admin/about', label: 'About', icon: Users },
  { href: '/admin/skills', label: 'Skills', icon: Star },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Users },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground dark">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold font-mono text-primary tracking-wider">ADMIN.SYS</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-card-border hover:text-foreground'}`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-card-border hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
