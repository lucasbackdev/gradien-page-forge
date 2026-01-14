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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    });

    return () => subscription.unsubscribe();
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
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signOut,
  };
};
