import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MapPin, Clock } from "lucide-react";

export const AdminBusinessStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-business-stats'],
    queryFn: async () => {
      const [
        businessCount,
        businessesWithOwners,
        categorizedBusinesses,
        recentBusinesses
      ] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).not('owner_id', 'is', null),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).not('category', 'is', null),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        totalBusinesses: businessCount.count || 0,
        businessesWithOwners: businessesWithOwners.count || 0,
        categorizedBusinesses: categorizedBusinesses.count || 0,
        recentBusinesses: recentBusinesses.count || 0
      };
    },
  });

  const statsCards = [
    {
      title: "Total Businesses",
      value: stats?.totalBusinesses || 0,
      icon: Building2,
      description: "All business listings"
    },
    {
      title: "With Owners",
      value: stats?.businessesWithOwners || 0,
      icon: Users,
      description: "Businesses assigned to owners"
    },
    {
      title: "Categorized",
      value: stats?.categorizedBusinesses || 0,
      icon: MapPin,
      description: "Businesses with categories"
    },
    {
      title: "Added This Week",
      value: stats?.recentBusinesses || 0,
      icon: Clock,
      description: "New businesses in last 7 days"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};