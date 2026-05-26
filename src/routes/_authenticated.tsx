import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [status, setStatus] = useState<"loading" | "signed-in" | "signed-out">("loading");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.session ? "signed-in" : "signed-out");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "signed-in" : "signed-out");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        লোড হচ্ছে...
      </div>
    );
  }

  if (status === "signed-out") return <Navigate to="/login" />;

  return <Outlet />;
}
