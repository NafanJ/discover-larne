import React, { useRef, useState } from 'react';
import { Upload, X, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessImages, type BusinessImage } from '@/hooks/use-business-images';
import { cn } from '@/lib/utils';

interface GalleryUploaderProps {
  businessId: string;
  images: BusinessImage[];
  onImagesUpdated: (images: BusinessImage[]) => void;
  className?: string;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  businessId,
  images,
  onImagesUpdated,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, removeImage, getImageUrl, updateImageOrder, isUploading } = useBusinessImages();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sortOrder = images.length + i;
      const uploadedImage = await uploadImage(businessId, file, 'gallery', sortOrder);
      
      if (uploadedImage) {
        onImagesUpdated([...images, uploadedImage]);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (image: BusinessImage, index: number) => {
    const success = await removeImage(image.id, image.storage_path);
    if (success) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesUpdated(newImages);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove from old position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Update sort orders
    for (let i = 0; i < newImages.length; i++) {
      if (newImages[i].sort_order !== i) {
        await updateImageOrder(newImages[i].id, i);
        newImages[i].sort_order = i;
      }
    }
    
    onImagesUpdated(newImages);
    setDraggedIndex(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              'relative group aspect-square rounded-lg overflow-hidden bg-muted cursor-move',
              draggedIndex === index && 'opacity-50'
            )}
          >
            <img
              src={getImageUrl(image.storage_path)}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 bg-white/20 rounded cursor-move">
                  <GripVertical className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(image, index)}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new image button */}
        <button
          onClick={handleFileSelect}
          disabled={isUploading}
          className={cn(
            'aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors',
            'flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed rounded-lg'
          )}
        >
          {isUploading ? (
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <>
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">Add Images</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};