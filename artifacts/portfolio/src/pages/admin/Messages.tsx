import React from "react";
import { useListContactMessages, useUpdateContactMessage, useDeleteContactMessage, getListContactMessagesQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, MailOpen, Trash2, Reply } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminMessages() {
  const { data: messages, isLoading } = useListContactMessages();
  const { mutate: updateMessage } = useUpdateContactMessage();
  const { mutate: deleteMessage } = useDeleteContactMessage();
  const { toast } = useToast();
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });

  const markRead = (id: number, read: boolean) => {
    updateMessage({ id, data: { read, replied: false } }, { onSuccess: invalidate });
  };

  const markReplied = (id: number) => {
    updateMessage({ id, data: { read: true, replied: true } }, { onSuccess: () => { toast({ title: "Marked as replied" }); invalidate(); } });
  };

  const handleDelete = (id: number) => {
    deleteMessage({ id }, { onSuccess: () => { toast({ title: "Message deleted" }); invalidate(); } });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight">Messages</h1>
        <p className="text-muted-foreground font-mono mt-2 text-sm tracking-wider">Contact form submissions</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
      ) : messages?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-mono text-sm uppercase tracking-widest">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages?.map((m) => (
            <div key={m.id} className={`p-5 border rounded-lg transition-colors ${m.read ? "border-border bg-card/30" : "border-primary/30 bg-primary/5"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-foreground">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-primary font-mono text-sm hover:underline">{m.email}</a>
                    {!m.read && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">NEW</span>}
                    {m.replied && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">REPLIED</span>}
                  </div>
                  <div className="text-sm font-medium text-foreground mt-1">{m.subject}</div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m.message}</p>
                  <div className="text-xs text-muted-foreground font-mono mt-3">
                    {new Date(m.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" title={m.read ? "Mark unread" : "Mark read"} onClick={() => markRead(m.id, !m.read)}>
                    {m.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  </Button>
                  <Button size="sm" variant="ghost" title="Mark as replied" onClick={() => markReplied(m.id)}>
                    <Reply className="w-3.5 h-3.5" />
                  </Button>
                  <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary" title="Reply via email">
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
