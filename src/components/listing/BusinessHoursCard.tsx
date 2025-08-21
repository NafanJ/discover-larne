import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isBusinessOpenNow, getCurrentDayName, formatBusinessHours } from '@/utils/businessHours';

interface BusinessHoursCardProps {
  workingHours?: any;
}

export const BusinessHoursCard = ({ workingHours }: BusinessHoursCardProps) => {
  // Check if working_hours exists and is not empty
  const hasWorkingHours = workingHours && 
    Array.isArray(workingHours) ? workingHours.length > 0 : 
    (typeof workingHours === 'string' && workingHours !== '[]' && workingHours.trim() !== '');
  
  if (!hasWorkingHours) {
    return (
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Opening hours not available</p>
        </CardContent>
      </Card>
    );
  }
  
  const isOpen = isBusinessOpenNow(workingHours);
  const currentDay = getCurrentDayName();
  const businessHours = formatBusinessHours(workingHours);

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Business Hours
          <Badge 
            variant="secondary" 
            className={`ml-auto ${
              isOpen 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            {isOpen ? 'Open now' : 'Closed'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {businessHours ? (
          <div className="space-y-2">
            {businessHours.map((h: any, i: number) => (
              <div 
                key={i} 
                className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                  h.day === currentDay 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className={`font-medium ${
                  h.day === currentDay ? 'text-primary' : 'text-foreground'
                }`}>
                  {h.day}
                </span>
                <span className={`text-sm ${
                  h.day === currentDay ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Business hours not available</p>
        )}
      </CardContent>
    </Card>
  );
};