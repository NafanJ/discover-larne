import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from './ImageUploader';
import { GalleryUploader } from './GalleryUploader';
import { Button } from '@/components/ui/button';
import { Upload, Image, Camera, Layout, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessImagePlaceholdersProps {
  businessId: string;
  onRefresh?: () => void;
  className?: string;
}

export const BusinessImagePlaceholders: React.FC<BusinessImagePlaceholdersProps> = ({
  businessId,
  onRefresh,
  className,
}) => {
  const handleImageUpdate = () => {
    onRefresh?.();
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload Images for this Business
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Help improve this listing by adding high-quality images that showcase this business.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Tile Image */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Tile Image</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Square image displayed on listing cards and search results (800×800px recommended)
            </p>
            <div className="w-48">
              <ImageUploader
                businessId={businessId}
                type="tile"
                onImageUploaded={handleImageUpdate}
                onImageRemoved={handleImageUpdate}
              />
            </div>
          </div>

          {/* Profile Image */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-muted-foreground/20 border-2 border-muted-foreground" />
              <h3 className="font-medium">Profile Image</h3>
              <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your business logo or main identifier (400×400px recommended, will be displayed as circular)
            </p>
            <div className="w-32">
              <ImageUploader
                businessId={businessId}
                type="profile"
                onImageUploaded={handleImageUpdate}
                onImageRemoved={handleImageUpdate}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-muted-foreground/20 rounded-sm" />
              <h3 className="font-medium">Cover Image</h3>
              <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Wide banner image for your listing header (1200×400px recommended)
            </p>
            <div className="max-w-2xl">
              <ImageUploader
                businessId={businessId}
                type="cover"
                onImageUploaded={handleImageUpdate}
                onImageRemoved={handleImageUpdate}
              />
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Gallery Images</h3>
              <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Multiple images showcasing your business, products, or services. Drag to reorder.
            </p>
            <GalleryUploader
              businessId={businessId}
              images={[]}
              onImagesUpdated={handleImageUpdate}
            />
          </div>

          {/* Upload Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">📸 Image Upload Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use high-quality images (JPG, PNG, or WebP format)</li>
              <li>• Maximum file size: 5MB per image</li>
              <li>• Square images work best for tile and profile photos</li>
              <li>• Use good lighting and avoid blurry photos</li>
              <li>• Include people and activities to show your business in action</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};