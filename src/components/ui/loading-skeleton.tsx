import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ListingCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="aspect-[4/3] overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-4 w-12 shrink-0" />
        </div>
        <Skeleton className="h-5 w-16 shrink-0" />
      </div>
    </CardHeader>
    <CardContent className="-mt-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-5 w-20" />
      </div>
    </CardContent>
  </Card>
);

const ListingsGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ListingCardSkeleton key={i} />
    ))}
  </div>
);

export { ListingCardSkeleton, ListingsGridSkeleton };