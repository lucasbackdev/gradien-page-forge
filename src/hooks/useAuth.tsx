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
    let refreshInterval: ReturnType<typeof setInterval> | null = null;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
        
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
        } else if (event === 'SIGNED_OUT') {
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
          console.error('Session error, attempting refresh:', error);
          // Try to refresh instead of giving up
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshData.session) {
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
          // Refresh succeeded, use the new session
          if (mounted) {
            setAuthState((prev) => ({
              ...prev,
              session: refreshData.session,
              user: refreshData.session?.user ?? null,
            }));
            if (refreshData.session?.user) {
              fetchUserData(refreshData.session.user.id);
            }
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

    // Proactively refresh session every 5 minutes to prevent expiration
    refreshInterval = setInterval(async () => {
      if (!mounted) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const expiresAt = session.expires_at ?? 0;
          const now = Math.floor(Date.now() / 1000);
          if (expiresAt - now < 600) {
            console.log('Token expiring soon, refreshing...');
            const { data } = await supabase.auth.refreshSession();
            if (data.session?.user && mounted) {
              fetchUserData(data.session.user.id);
            }
          }
        }
      } catch (err) {
        console.error('Proactive refresh error:', err);
      }
    }, 5 * 60 * 1000); // every 5 minutes

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const fetchUserData = async (userId: string, retried = false) => {
    try {
      // Check if user is admin
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin");

      // If JWT expired, try refreshing session and retry once
      if (rolesError && (rolesError.message === 'JWT expired' || rolesError.code === 'PGRST303') && !retried) {
        console.log('JWT expired during fetchUserData, refreshing...');
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData.session) {
          return fetchUserData(userId, true);
        }
      }

      if (rolesError) throw rolesError;

      // Get subscription info
      const { data: sub, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (subError && (subError.message === 'JWT expired' || subError.code === 'PGRST303') && !retried) {
        console.log('JWT expired during fetchUserData (sub), refreshing...');
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData.session) {
          return fetchUserData(userId, true);
        }
      }

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
      // Don't clear subscription on transient errors - keep previous state
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
