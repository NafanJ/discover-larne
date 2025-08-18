import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ImageType = 'tile' | 'profile' | 'cover' | 'gallery';

export interface BusinessImage {
  id: string;
  business_id: string;
  type: ImageType;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export const useBusinessImages = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadImage = async (
    businessId: string,
    file: File,
    type: ImageType,
    sortOrder: number = 0
  ): Promise<BusinessImage | null> => {
    if (!validateFile(file)) return null;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `businesses/${businessId}/${type}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // For single image types, remove existing image
      if (['tile', 'profile', 'cover'].includes(type)) {
        await removeImagesByType(businessId, type);
      }

      // Insert image metadata
      const { data, error } = await supabase
        .from('business_images')
        .insert({
          business_id: businessId,
          type,
          storage_path: filePath,
          sort_order: sortOrder,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Image uploaded successfully",
        description: `${type} image has been uploaded.`,
      });

      return data as BusinessImage;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (imageId: string, storagePath: string): Promise<boolean> => {
    try {
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('business-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Remove from database
      const { error: dbError } = await supabase
        .from('business_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      toast({
        title: "Image removed",
        description: "Image has been successfully removed.",
      });

      return true;
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeImagesByType = async (businessId: string, type: ImageType): Promise<void> => {
    try {
      // Get existing images of this type
      const { data: existingImages } = await supabase
        .from('business_images')
        .select('id, storage_path')
        .eq('business_id', businessId)
        .eq('type', type);

      if (existingImages && existingImages.length > 0) {
        // Remove from storage
        const paths = existingImages.map(img => img.storage_path);
        await supabase.storage.from('business-images').remove(paths);

        // Remove from database
        const ids = existingImages.map(img => img.id);
        await supabase.from('business_images').delete().in('id', ids);
      }
    } catch (error) {
      console.error('Error removing existing images:', error);
    }
  };

  const getImageUrl = (storagePath: string): string => {
    const { data } = supabase.storage
      .from('business-images')
      .getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const updateImageOrder = async (imageId: string, newSortOrder: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('business_images')
        .update({ sort_order: newSortOrder })
        .eq('id', imageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update order error:', error);
      return false;
    }
  };

  return {
    uploadImage,
    removeImage,
    getImageUrl,
    updateImageOrder,
    isUploading,
  };
};