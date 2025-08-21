import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AboutSectionProps {
  business: {
    description?: string;
    category?: string;
    wheelchair_accessible?: boolean;
  };
}

export const AboutSection = ({ business }: AboutSectionProps) => {
  // Generate highlight chips based on business data
  const getHighlightChips = () => {
    const chips = [];
    
    if (business.category) {
      const category = business.category.toLowerCase();
      if (category.includes('restaurant') || category.includes('food')) {
        chips.push('Family-friendly');
      }
      if (category.includes('ice cream') || category.includes('toys') || category.includes('sweet')) {
        chips.push('Ice cream parlour', 'Toy shop');
      }
      if (category.includes('local') || category.includes('favourite')) {
        chips.push('Local favourite');
      }
    }
    
    if (business.wheelchair_accessible) {
      chips.push('Wheelchair accessible');
    }
    
    // Add some default chips if none found
    if (chips.length === 0) {
      chips.push('Local business', 'Community favourite');
    }
    
    return chips;
  };

  const highlightChips = getHighlightChips();
  
  // Format description into readable paragraphs
  const formatDescription = (description?: string) => {
    if (!description) return ['No description available.'];
    
    // Split long descriptions into paragraphs
    const sentences = description.split('. ');
    if (sentences.length <= 2) return [description];
    
    const midPoint = Math.ceil(sentences.length / 2);
    const firstParagraph = sentences.slice(0, midPoint).join('. ') + (sentences.length > midPoint ? '.' : '');
    const secondParagraph = sentences.slice(midPoint).join('. ');
    
    return [firstParagraph, secondParagraph].filter(p => p.trim().length > 0);
  };

  const paragraphs = formatDescription(business.description);

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description Paragraphs */}
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Highlight Chips */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Features</h3>
          <div className="flex flex-wrap gap-2">
            {highlightChips.map((chip, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
              >
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};