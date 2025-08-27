import { Phone, Globe, MapPin, Accessibility } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/use-analytics';

interface ContactCardProps {
  business: {
    id: string;
    phone?: string;
    site?: string;
    full_address?: string;
    wheelchair_accessible?: boolean;
  };
}

export const ContactCard = ({ business }: ContactCardProps) => {
  const { trackOutboundClick } = useAnalytics();
  const contactItems = [
    {
      icon: Phone,
      label: 'Phone',
      value: business.phone,
      action: business.phone ? () => {
        trackOutboundClick(business.id, 'call', `tel:${business.phone}`);
        window.open(`tel:${business.phone}`, '_self');
      } : undefined,
      className: 'text-sky-600 dark:text-sky-400'
    },
    {
      icon: Globe,
      label: 'Website',
      value: business.site,
      action: business.site ? () => {
        trackOutboundClick(business.id, 'website', business.site!);
        window.open(business.site, '_blank', 'noopener noreferrer');
      } : undefined,
      className: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: business.full_address,
      action: business.full_address ? () => {
        const encodedAddress = encodeURIComponent(business.full_address!);
        const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
        trackOutboundClick(business.id, 'directions', mapsUrl);
        window.open(mapsUrl, '_blank', 'noopener noreferrer');
      } : undefined,
      className: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contactItems.map((item, index) => {
          if (!item.value) return null;
          
          const content = (
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <item.icon className={`h-5 w-5 mt-0.5 ${item.className}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="text-sm text-muted-foreground break-words">
                  {item.value}
                </div>
              </div>
            </div>
          );

          return item.action ? (
            <button
              key={index}
              onClick={item.action}
              className="w-full text-left hover:scale-[1.02] transition-transform"
            >
              {content}
            </button>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
        
        {/* Accessibility Info */}
        {typeof business.wheelchair_accessible === 'boolean' && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Accessibility className={`h-5 w-5 mt-0.5 ${
              business.wheelchair_accessible 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-muted-foreground'
            }`} />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Accessibility</div>
              <div className="text-sm text-muted-foreground">
                {business.wheelchair_accessible ? '✓ Wheelchair accessible' : '✗ Not wheelchair accessible'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};