import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Building, UserCheck } from "lucide-react";

export const UserStatsCards = () => {
  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { count: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { count: adminCount, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'admin');

      const { count: businessOwnerCount, error: businessOwnerError } = await supabase
        .from('user_roles')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'business_owner');

      const { count: visitorCount, error: visitorError } = await supabase
        .from('user_roles')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'visitor');

      if (totalError || adminError || businessOwnerError || visitorError) {
        throw new Error('Failed to fetch user stats');
      }

      return {
        total: totalUsers || 0,
        admins: adminCount || 0,
        businessOwners: businessOwnerCount || 0,
        visitors: visitorCount || 0,
      };
    },
  });

  const stats = [
    {
      title: "Total Users",
      value: userStats?.total || 0,
      icon: Users,
      description: "All registered users"
    },
    {
      title: "Admins",
      value: userStats?.admins || 0,
      icon: Shield,
      description: "System administrators"
    },
    {
      title: "Business Owners",
      value: userStats?.businessOwners || 0,
      icon: Building,
      description: "Users with businesses"
    },
    {
      title: "Visitors",
      value: userStats?.visitors || 0,
      icon: UserCheck,
      description: "Regular users"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};