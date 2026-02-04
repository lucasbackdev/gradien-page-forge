import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionInfo {
  type: "free_trial" | "monthly" | "annual" | "lifetime";
  status: "active" | "expired" | "cancelled" | "pending";
  expiresAt: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  subscription: SubscriptionInfo | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
    subscription: null,
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Defer Supabase calls with setTimeout to avoid deadlocks
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchUserData(session.user.id);
            }
          }, 0);
        } else {
          setAuthState((prev) => ({
            ...prev,
            isAdmin: false,
            subscription: null,
            loading: false,
          }));
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Clear local state on session error
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAdmin: false,
              subscription: null,
            });
          }
          return;
        }

        if (!mounted) return;

        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Init session error:', err);
        if (mounted) {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin");

      // Get subscription info
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      setAuthState((prev) => ({
        ...prev,
        isAdmin: (roles && roles.length > 0) || false,
        subscription: sub
          ? {
              type: sub.subscription_type as SubscriptionInfo["type"],
              status: sub.status as SubscriptionInfo["status"],
              expiresAt: sub.expires_at,
            }
          : null,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    // Limpar estado local primeiro (UI responde imediatamente)
    setAuthState({
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      subscription: null,
    });

    // Importante: quando a sessão já expirou no servidor, o logout "global" pode falhar
    // com "session_not_found". Nesse caso, garantimos ao menos o logout local.
    try {
      await supabase.auth.signOut();
    } catch {
      await supabase.auth.signOut({ scope: "local" });
    }
  };

  return {
    ...authState,
    signOut,
  };
};
