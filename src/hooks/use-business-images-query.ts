import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BusinessImage, ImageType } from '@/hooks/use-business-images';

export const useBusinessImagesQuery = (businessId: string) => {
  return useQuery({
    queryKey: ['business-images', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_images')
        .select('*')
        .eq('business_id', businessId)
        .order('type')
        .order('sort_order');

      if (error) throw error;
      return data as BusinessImage[];
    },
    enabled: !!businessId,
  });
};

export const useBusinessImagesByType = (businessId: string, type: ImageType) => {
  return useQuery({
    queryKey: ['business-images', businessId, type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_images')
        .select('*')
        .eq('business_id', businessId)
        .eq('type', type)
        .order('sort_order');

      if (error) throw error;
      return data as BusinessImage[];
    },
    enabled: !!businessId,
  });
};

export const useInvalidateBusinessImages = () => {
  const queryClient = useQueryClient();
  
  return (businessId: string) => {
    queryClient.invalidateQueries({ 
      queryKey: ['business-images', businessId] 
    });
  };
};