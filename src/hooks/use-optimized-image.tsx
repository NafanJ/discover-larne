import { useState, useEffect, useRef } from 'react';

interface UseOptimizedImageProps {
  src: string;
  placeholder?: string;
}

export const useOptimizedImage = ({ src, placeholder = '/placeholder.svg' }: UseOptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (!src || src === placeholder) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    imgRef.current = img;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setImageSrc(placeholder);
      setIsLoading(false);
      setHasError(true);
    };

    img.src = src;

    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
      }
    };
  }, [src, placeholder]);

  return { imageSrc, isLoading, hasError };
};