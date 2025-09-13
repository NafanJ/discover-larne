import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthMonitoring } from './use-auth-monitoring';

type AppRole = 'visitor' | 'business_owner' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (requiredRole: AppRole) => boolean;
  canEditBusiness: (businessOwnerId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Enable auth monitoring
  useAuthMonitoring();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        // If user doesn't exist in database or token invalid, sign them out
        if ((error as any)?.message?.includes('JWT') || (error as any)?.code === 'PGRST301') {
          console.log('User deleted from database, signing out...');
          await supabase.auth.signOut();
          return null;
        }
        // Non-fatal errors: treat as visitor to keep public access working
        return 'visitor';
      }

      if (!data) {
        // No role row found: default to visitor (do not sign out)
        return 'visitor';
      }

      const role = (data?.role as AppRole) || 'visitor';
      console.log('Fetched role:', role);
      return role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'visitor';
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Defer Supabase calls to avoid deadlocks in the callback
        setTimeout(() => {
          fetchUserRole(session.user!.id).then((userRole) => {
            setRole(userRole);
            setLoading(false);
          });
        }, 0);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then((userRole) => {
          setRole(userRole);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Track failed login attempts for security monitoring
    if (error) {
      try {
        await supabase.from('analytics_events').insert({
          event_type: 'auth_failed_login',
          event_data: {
            email: email,
            error_message: error.message,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        });
      } catch (analyticsError) {
        // Silent fail for analytics - don't block auth flow
        console.warn('Failed to track failed login:', analyticsError);
      }
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || '',
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    // Force clear all auth state
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-yggncfjphyywfkrqfkyi-auth-token');
    setUser(null);
    setSession(null);
    setRole(null);
    await supabase.auth.signOut();
    // Force page reload to clear any cached state
    window.location.href = '/';
  };

  const hasRole = (requiredRole: AppRole): boolean => {
    if (!role) return false;
    
    const roleHierarchy = {
      admin: 3,
      business_owner: 2,
      visitor: 1,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const canEditBusiness = (businessOwnerId?: string): boolean => {
    if (!user) return false;
    if (role === 'admin') return true;
    if (role === 'business_owner' && businessOwnerId === user.id) return true;
    return false;
  };

  const value = {
    user,
    session,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    canEditBusiness,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}