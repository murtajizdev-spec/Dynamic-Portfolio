import React, { useEffect, useState } from "react";
import AdminLogin from "@/pages/admin/Login";

interface Props {
  children: React.ReactNode;
}

type AuthState = "loading" | "authenticated" | "unauthenticated";

export default function AdminGuard({ children }: Props) {
  const [state, setState] = useState<AuthState>("loading");

  async function checkAuth() {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json() as { authenticated: boolean };
      setState(data.authenticated ? "authenticated" : "unauthenticated");
    } catch {
      setState("unauthenticated");
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-mono text-sm tracking-widest animate-pulse">
          AUTHENTICATING_
        </div>
      </div>
    );
  }

  if (state === "unauthenticated") {
    return <AdminLogin onSuccess={() => setState("authenticated")} />;
  }

  return <>{children}</>;
}
