import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export interface BusinessContacts {
  id: string;
  business_id: string;
  phone: string | null;
  full_address: string | null;
}

export function useBusinessContacts(businessId: string) {
  const { user, hasRole } = useAuth();

  return useQuery({
    queryKey: ['business-contacts', businessId],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      // Check if user is admin or business owner
      const isAdmin = hasRole('admin');
      const isBusinessOwner = hasRole('business_owner');

      if (!isAdmin && !isBusinessOwner) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_contacts')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user && !!businessId,
  });
}