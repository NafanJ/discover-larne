import React from 'react';
import { useBusinessImagesQuery, useBusinessImagesByType } from '@/hooks/use-business-images-query';
import { useBusinessImages } from '@/hooks/use-business-images';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface BusinessImageDisplayProps {
  businessId: string;
  className?: string;
}

export const BusinessCoverImage: React.FC<BusinessImageDisplayProps> = ({
  businessId,
  className,
}) => {
  const { data: coverImages = [], isLoading } = useBusinessImagesByType(businessId, 'cover');
  const { data: profileImages = [] } = useBusinessImagesByType(businessId, 'profile');
  const { getImageUrl } = useBusinessImages();

  if (isLoading) {
    return <Skeleton className={cn('w-full h-48 md:h-64', className)} />;
  }

  const coverImage = coverImages[0];
  const profileImage = profileImages[0];

  if (!coverImage && !profileImage) return null;

  return (
    <div className={cn('relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-muted', className)}>
      {coverImage && (
        <img
          src={getImageUrl(coverImage.storage_path)}
          alt="Business cover"
          className="w-full h-full object-cover"
        />
      )}
      
      {profileImage && (
        <div className="absolute bottom-4 left-4 w-16 h-16 md:w-20 md:h-20">
          <img
            src={getImageUrl(profileImage.storage_path)}
            alt="Business profile"
            className="w-full h-full object-cover rounded-full border-4 border-background shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export const BusinessGallery: React.FC<BusinessImageDisplayProps> = ({
  businessId,
  className,
}) => {
  const { data: galleryImages = [], isLoading } = useBusinessImagesByType(businessId, 'gallery');
  const { getImageUrl } = useBusinessImages();

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );
  }

  if (galleryImages.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-xl font-semibold">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={getImageUrl(image.storage_path)}
              alt={`Gallery image ${image.sort_order + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const BusinessTileImage: React.FC<BusinessImageDisplayProps & { fallbackSrc?: string }> = ({
  businessId,
  fallbackSrc,
  className,
}) => {
  const { data: tileImages = [], isLoading } = useBusinessImagesByType(businessId, 'tile');
  const { data: profileImages = [] } = useBusinessImagesByType(businessId, 'profile');
  const { data: galleryImages = [] } = useBusinessImagesByType(businessId, 'gallery');
  const { getImageUrl } = useBusinessImages();

  if (isLoading) {
    return <Skeleton className={cn('w-full aspect-[4/3]', className)} />;
  }

  // Priority: tile > profile > first gallery > fallback
  let imageToShow = null;
  let altText = 'Business image';

  if (tileImages[0]) {
    imageToShow = tileImages[0];
    altText = 'Business tile image';
  } else if (profileImages[0]) {
    imageToShow = profileImages[0];
    altText = 'Business profile image';
  } else if (galleryImages[0]) {
    imageToShow = galleryImages[0];
    altText = 'Business gallery image';
  }

  const imageSrc = imageToShow ? getImageUrl(imageToShow.storage_path) : fallbackSrc;

  if (!imageSrc) {
    return (
      <div className={cn('w-full aspect-[4/3] bg-muted flex items-center justify-center', className)}>
        <span className="text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={altText}
      className={cn('w-full aspect-[4/3] object-cover', className)}
      loading="lazy"
    />
  );
};