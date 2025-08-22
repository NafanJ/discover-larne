import { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useBusinessImagesQuery, useInvalidateBusinessImages } from '@/hooks/use-business-images-query';
import { useBusinessImages } from '@/hooks/use-business-images';
import { GalleryUploader } from '@/components/business/GalleryUploader';
import type { BusinessImage } from '@/hooks/use-business-images';

interface ModernGalleryProps {
  businessId: string;
}

export const ModernGallery = ({ businessId }: ModernGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: images = [] } = useBusinessImagesQuery(businessId);
  const invalidateImages = useInvalidateBusinessImages();
  const { getImageUrl } = useBusinessImages();
  
  // Filter gallery images
  const galleryImages = images.filter(img => img.type === 'gallery');

  const handleImagesUpdated = (updatedImages: BusinessImage[]) => {
    // Invalidate the query to refetch the latest data
    invalidateImages(businessId);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (galleryImages.length === 0) {
    return (
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="text-muted-foreground">No images available yet</div>
            <GalleryUploader 
              businessId={businessId} 
              images={galleryImages}
              onImagesUpdated={handleImagesUpdated}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">Gallery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className={`group relative overflow-hidden rounded-lg bg-muted hover:scale-[1.02] transition-transform duration-200 ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <img
                  src={getImageUrl(image.storage_path)}
                  alt={`Gallery image ${index + 1}`}
                  className={`w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                    index === 0 ? 'h-64 md:h-80' : 'h-32 md:h-40'
                  }`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </button>
            ))}
          </div>
          
          {/* Upload Section */}
          <div className="pt-4 border-t border-border/50">
            <GalleryUploader 
              businessId={businessId} 
              images={galleryImages}
              onImagesUpdated={handleImagesUpdated}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-none">
          <DialogTitle className="sr-only">Gallery Image Viewer</DialogTitle>
          <div className="relative">
            {/* Close Button */}
            <Button
              onClick={() => setLightboxOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {galleryImages.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button
                  onClick={nextImage}
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <img
              src={getImageUrl(galleryImages[currentImageIndex]?.storage_path)}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};