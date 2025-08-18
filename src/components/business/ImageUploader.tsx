import React, { useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessImages, type ImageType, type BusinessImage } from '@/hooks/use-business-images';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  businessId: string;
  type: ImageType;
  currentImage?: BusinessImage;
  onImageUploaded?: (image: BusinessImage) => void;
  onImageRemoved?: () => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  businessId,
  type,
  currentImage,
  onImageUploaded,
  onImageRemoved,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, removeImage, getImageUrl, isUploading } = useBusinessImages();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedImage = await uploadImage(businessId, file, type);
    if (uploadedImage && onImageUploaded) {
      onImageUploaded(uploadedImage);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!currentImage) return;
    
    const success = await removeImage(currentImage.id, currentImage.storage_path);
    if (success && onImageRemoved) {
      onImageRemoved();
    }
  };

  const getDisplayStyle = () => {
    switch (type) {
      case 'profile':
        return 'aspect-square rounded-full';
      case 'cover':
        return 'aspect-[3/1] rounded-lg';
      case 'tile':
        return 'aspect-[4/3] rounded-lg';
      default:
        return 'aspect-square rounded-lg';
    }
  };

  const getUploadText = () => {
    switch (type) {
      case 'profile':
        return 'Upload Profile Image';
      case 'cover':
        return 'Upload Cover Image';
      case 'tile':
        return 'Upload Tile Image';
      default:
        return 'Upload Image';
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {currentImage ? (
        <div className={cn('relative overflow-hidden bg-muted', getDisplayStyle())}>
          <img
            src={getImageUrl(currentImage.storage_path)}
            alt={`${type} image`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                onClick={handleFileSelect}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleFileSelect}
          disabled={isUploading}
          className={cn(
            'w-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors',
            'flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getDisplayStyle()
          )}
        >
          {isUploading ? (
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <>
              <Image className="w-8 h-8" />
              <span className="text-sm font-medium">{getUploadText()}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};