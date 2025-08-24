import { Edit, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface CTASectionProps {
  businessOwnerId?: string;
}

export const CTASection = ({ businessOwnerId }: CTASectionProps) => {
  const { user, role, canEditBusiness } = useAuth();

  const canEdit = canEditBusiness(businessOwnerId);
  const showOwnershipButton = !user || (role !== 'admin' && businessOwnerId !== user?.id);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-border/50">
      {canEdit ? (
        <Button 
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Edit className="h-4 w-4" />
          Edit Business
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950"
        >
          <Edit className="h-4 w-4" />
          Suggest an edit
        </Button>
      )}
      
      {showOwnershipButton && (
        <Button 
          variant="ghost"
          className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950"
        >
          <Building2 className="h-4 w-4" />
          Own this business?
        </Button>
      )}
    </div>
  );
};