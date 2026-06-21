import React, { useEffect } from "react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminDashboard() {
  const { data: stats } = useGetDashboardStats();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight">System Overview</h1>
        <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Metrics and recent activity</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Projects", value: stats?.totalProjects || 0, color: "text-blue-400" },
          { label: "Blog Posts", value: stats?.totalBlogPosts || 0, color: "text-purple-400" },
          { label: "Messages", value: stats?.totalMessages || 0, color: "text-emerald-400" },
          { label: "Skills", value: stats?.totalSkills || 0, color: "text-amber-400" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card border border-white/5 rounded-lg shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h3 className="text-muted-foreground font-mono text-xs uppercase tracking-widest">{stat.label}</h3>
            <p className={`text-5xl font-bold mt-4 tracking-tighter ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
