import { Phone, Globe, MapPin, Accessibility, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/use-analytics';
import { useBusinessContacts } from '@/hooks/use-business-contacts';
import { useAuth } from '@/hooks/use-auth';

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
  const { user, hasRole } = useAuth();
  const { data: contacts } = useBusinessContacts(business.id);

  // Check if user can view sensitive contact info
  const canViewContacts = user && (hasRole('admin') || hasRole('business_owner'));
  
  // Use secured contact data if available and user is authorized, otherwise show limited info
  const phoneValue = canViewContacts && contacts?.phone ? contacts.phone : null;
  const addressValue = canViewContacts && contacts?.full_address ? contacts.full_address : null;

  const contactItems = [
    {
      icon: Phone,
      label: 'Phone',
      value: phoneValue,
      action: phoneValue ? () => {
        trackOutboundClick(business.id, 'call', `tel:${phoneValue}`);
        window.open(`tel:${phoneValue}`, '_self');
      } : undefined,
      className: 'text-sky-600 dark:text-sky-400',
      protected: !canViewContacts && (contacts?.phone || business.phone)
    },
    {
      icon: Globe,
      label: 'Website',
      value: business.site,
      action: business.site ? () => {
        trackOutboundClick(business.id, 'website', business.site!);
        window.open(business.site, '_blank', 'noopener noreferrer');
      } : undefined,
      className: 'text-emerald-600 dark:text-emerald-400',
      protected: false
    },
    {
      icon: MapPin,
      label: 'Address',
      value: addressValue,
      action: addressValue ? () => {
        const encodedAddress = encodeURIComponent(addressValue);
        const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
        trackOutboundClick(business.id, 'directions', mapsUrl);
        window.open(mapsUrl, '_blank', 'noopener noreferrer');
      } : undefined,
      className: 'text-rose-600 dark:text-rose-400',
      protected: !canViewContacts && (contacts?.full_address || business.full_address)
    }
  ];

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contactItems.map((item, index) => {
          // Show protected items with lock icon
          if (item.protected) {
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Lock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
                    Login as business owner to view contact details
                  </div>
                </div>
              </div>
            );
          }

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