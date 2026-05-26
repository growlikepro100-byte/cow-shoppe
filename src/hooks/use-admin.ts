import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentUserId() {
  const [uid, setUid] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUid(data.session?.user.id ?? null);
      setIsAuthReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUid(s?.user?.id ?? null);
      setIsAuthReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { userId: uid, isAuthReady };
}

export function useIsAdmin() {
  const { userId, isAuthReady } = useCurrentUserId();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["is-admin", userId],
    enabled: isAuthReady && !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
  });

  return {
    isAdmin: !!data,
    userId,
    isAuthReady,
    isCheckingAdmin: isAuthReady && !!userId && (isLoading || isFetching),
  };
}
