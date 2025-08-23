import { Phone, Globe, Navigation, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBusinessImagesByType } from '@/hooks/use-business-images-query';
import { useBusinessImages } from '@/hooks/use-business-images';

interface HeroSectionProps {
  businessId: string;
  business: {
    name: string;
    category?: string;
    rating?: number;
    phone?: string;
    site?: string;
    full_address?: string;
  };
}

export const HeroSection = ({ businessId, business }: HeroSectionProps) => {
  const { data: coverImages = [] } = useBusinessImagesByType(businessId, 'cover');
  const { data: profileImages = [] } = useBusinessImagesByType(businessId, 'profile');
  const { getImageUrl } = useBusinessImages();
  const handleCall = () => {
    if (business.phone) {
      window.open(`tel:${business.phone}`, '_self');
    }
  };

  const handleWebsite = () => {
    if (business.site) {
      window.open(business.site, '_blank', 'noopener noreferrer');
    }
  };

  const handleDirections = () => {
    if (business.full_address) {
      const encodedAddress = encodeURIComponent(business.full_address);
      window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank', 'noopener noreferrer');
    }
  };

  // Get cover and profile images with proper URLs
  const coverImage = coverImages[0]?.storage_path ? getImageUrl(coverImages[0].storage_path) : null;
  const profileImage = profileImages[0]?.storage_path ? getImageUrl(profileImages[0].storage_path) : null;

  // Generate mock review count for demo
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  return (
    <section className="relative h-80 md:h-96 overflow-hidden rounded-lg mb-6 md:mb-8">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: coverImage 
            ? `url(${coverImage})` 
            : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
        <div className="flex items-end gap-4 md:gap-6">
          {/* Profile Image */}
          {profileImage && (
            <div className="flex-shrink-0 mb-3 md:mb-4">
              <img
                src={profileImage}
                alt={`${business.name} profile`}
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white/20 object-cover shadow-lg"
              />
            </div>
          )}
          
          {/* Business Info */}
          <div className="flex-1 space-y-3 md:space-y-4">
            {/* Category Badge */}
            {business.category && (
              <Badge variant="secondary" className="w-fit bg-white/20 text-white border-white/30 hover:bg-white/30">
                {business.category.split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')}
              </Badge>
            )}
            
            {/* Business Name */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {business.name}
            </h1>
            
            {/* Rating */}
            {typeof business.rating === 'number' && (
              <div className="flex items-center gap-2 text-white">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= business.rating! 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-white/50'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base md:text-lg font-medium">{business.rating.toFixed(1)}</span>
                <span className="text-white/80 text-sm md:text-base">• {reviewCount} reviews</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
              {business.phone && (
                <Button 
                  onClick={handleCall}
                  size="default"
                  className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm text-sm md:text-base px-3 md:px-6"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
              )}
              
              {business.site && (
                <Button 
                  onClick={handleWebsite}
                  size="default"
                  className="bg-sky-500 text-white hover:bg-sky-600 text-sm md:text-base px-3 md:px-6"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Website</span>
                </Button>
              )}
              
              {business.full_address && (
                <Button 
                  onClick={handleDirections}
                  size="default"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm text-sm md:text-base px-3 md:px-6"
                >
                  <Navigation className="h-4 w-4" />
                  <span className="hidden sm:inline">Directions</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};