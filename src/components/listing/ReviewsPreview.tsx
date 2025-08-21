import { Star, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewsPreviewProps {
  businessName: string;
  rating?: number;
}

export const ReviewsPreview = ({ businessName, rating }: ReviewsPreviewProps) => {
  // Mock reviews data - in a real app, this would come from props or API
  const mockReviews = [
    {
      id: 1,
      author: "Google user",
      rating: 4.5,
      text: `Friendly staff, brilliant ice cream, and a lovely toy section for the kids. Great local spot!`,
      date: "2 weeks ago"
    },
    {
      id: 2,
      author: "Google user", 
      rating: 5.0,
      text: `Friendly staff, brilliant ice cream, and a lovely toy section for the kids. Great local spot!`,
      date: "1 month ago"
    }
  ];

  const totalReviews = Math.floor(Math.random() * 500) + 50;

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Reviews</CardTitle>
          <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700 hover:bg-sky-50">
            See all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{review.author}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
        
        {rating && (
          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Average rating: <span className="font-medium text-foreground">{rating.toFixed(1)}</span> 
              {" • "}{totalReviews} reviews
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};