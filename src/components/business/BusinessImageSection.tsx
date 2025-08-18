import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from './ImageUploader';
import { GalleryUploader } from './GalleryUploader';
import { useBusinessImagesQuery, useInvalidateBusinessImages } from '@/hooks/use-business-images-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { BusinessImage } from '@/hooks/use-business-images';

interface BusinessImageSectionProps {
  businessId: string;
}

export const BusinessImageSection: React.FC<BusinessImageSectionProps> = ({
  businessId,
}) => {
  const { data: images = [], isLoading } = useBusinessImagesQuery(businessId);
  const invalidateImages = useInvalidateBusinessImages();

  const handleImageUpdate = () => {
    invalidateImages(businessId);
  };

  const getImageByType = (type: string) => {
    return images.find(img => img.type === type);
  };

  const getGalleryImages = () => {
    return images.filter(img => img.type === 'gallery').sort((a, b) => a.sort_order - b.sort_order);
  };

  const handleGalleryUpdate = (updatedImages: BusinessImage[]) => {
    // The gallery component handles the update internally
    // We just need to invalidate the query to refetch
    setTimeout(() => invalidateImages(businessId), 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tile Image */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tile Image</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Square image shown on listing cards (recommended: 800x800px)
            </p>
            <div className="w-48">
              <ImageUploader
                businessId={businessId}
                type="tile"
                currentImage={getImageByType('tile')}
                onImageUploaded={handleImageUpdate}
                onImageRemoved={handleImageUpdate}
              />
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <h3 className="text-sm font-medium mb-2">Profile Image</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Circular logo or avatar for your business (recommended: 400x400px)
            </p>
            <div className="w-32">
              <ImageUploader
                businessId={businessId}
                type="profile"
                currentImage={getImageByType('profile')}
                onImageUploaded={handleImageUpdate}
                onImageRemoved={handleImageUpdate}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <h3 className="text-sm font-medium mb-2">Cover Image</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Wide banner image for your listing header (recommended: 1200x400px)
            </p>
            <div className="max-w-2xl">
              <ImageUploader
                businessId={businessId}
                type="cover"
                currentImage={getImageByType('cover')}
                onImageUploaded={handleImageUpdate}
                onImageRemoved={handleImageUpdate}
              />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="text-sm font-medium mb-2">Gallery</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Multiple images showcasing your business. Drag to reorder.
            </p>
            <GalleryUploader
              businessId={businessId}
              images={getGalleryImages()}
              onImagesUpdated={handleGalleryUpdate}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};