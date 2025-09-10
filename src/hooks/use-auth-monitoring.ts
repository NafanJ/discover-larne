import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthMonitoring() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Track authentication events for security monitoring
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
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
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
}