import { Edit, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-border/50">
      <Button 
        variant="ghost" 
        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950"
      >
        <Edit className="h-4 w-4" />
        Suggest an edit
      </Button>
      
      <Button 
        variant="ghost"
        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950"
      >
        <Building2 className="h-4 w-4" />
        Own this business?
      </Button>
    </div>
  );
};