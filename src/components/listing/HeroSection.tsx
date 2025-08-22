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
    <section className="relative h-96 overflow-hidden rounded-lg mb-8">
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
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="flex items-end gap-6">
          {/* Profile Image */}
          {profileImage && (
            <div className="flex-shrink-0 mb-4">
              <img
                src={profileImage}
                alt={`${business.name} profile`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 object-cover shadow-lg"
              />
            </div>
          )}
          
          {/* Business Info */}
          <div className="flex-1 space-y-4">
            {/* Category Badge */}
            {business.category && (
              <Badge variant="secondary" className="w-fit bg-white/20 text-white border-white/30 hover:bg-white/30">
                {business.category.split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')}
              </Badge>
            )}
            
            {/* Business Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
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
                <span className="text-lg font-medium">{business.rating.toFixed(1)}</span>
                <span className="text-white/80">• {reviewCount} reviews</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {business.phone && (
                <Button 
                  onClick={handleCall}
                  size="lg"
                  className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              )}
              
              {business.site && (
                <Button 
                  onClick={handleWebsite}
                  size="lg"
                  className="bg-sky-500 text-white hover:bg-sky-600"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </Button>
              )}
              
              {business.full_address && (
                <Button 
                  onClick={handleDirections}
                  size="lg"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};