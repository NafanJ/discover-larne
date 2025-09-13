import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthMonitoring() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Track authentication events for security monitoring
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Defer DB call to avoid blocking the auth callback
        setTimeout(async () => {
          try {
            await supabase.from('analytics_events').insert({
              event_type: `auth_${event.toLowerCase()}`,
              event_data: {
                user_id: session?.user?.id || null,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                ip_address: null // Server-side tracking would be needed for IP
              }
            });
          } catch (error) {
            // Silent fail for analytics - don't block auth flow
            console.warn('Failed to track auth event:', error);
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}