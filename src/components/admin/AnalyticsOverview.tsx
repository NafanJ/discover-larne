import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { subDays, format } from "date-fns";

export const AnalyticsOverview = () => {
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics-overview'],
    queryFn: async () => {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      const sixtyDaysAgo = subDays(today, 60);

      // Get current period stats (last 30 days)
      const { count: currentUsers, error: currentUsersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', format(thirtyDaysAgo, 'yyyy-MM-dd'));

      const { count: currentBusinesses, error: currentBusinessesError } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', format(thirtyDaysAgo, 'yyyy-MM-dd'));

      // Get previous period stats (30-60 days ago)
      const { count: previousUsers, error: previousUsersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', format(sixtyDaysAgo, 'yyyy-MM-dd'))
        .lt('created_at', format(thirtyDaysAgo, 'yyyy-MM-dd'));

      const { count: previousBusinesses, error: previousBusinessesError } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', format(sixtyDaysAgo, 'yyyy-MM-dd'))
        .lt('created_at', format(thirtyDaysAgo, 'yyyy-MM-dd'));

      // Get total counts
      const { count: totalUsers, error: totalUsersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { count: totalBusinesses, error: totalBusinessesError } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true });

      const { count: assignedBusinesses, error: assignedBusinessesError } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .not('owner_id', 'is', null);

      if (currentUsersError || currentBusinessesError || previousUsersError || 
          previousBusinessesError || totalUsersError || totalBusinessesError || 
          assignedBusinessesError) {
        throw new Error('Failed to fetch analytics data');
      }

      const userGrowthRate = previousUsers && previousUsers > 0 
        ? ((currentUsers || 0) - (previousUsers || 0)) / (previousUsers || 1) * 100
        : currentUsers ? 100 : 0;

      const businessGrowthRate = previousBusinesses && previousBusinesses > 0
        ? ((currentBusinesses || 0) - (previousBusinesses || 0)) / (previousBusinesses || 1) * 100
        : currentBusinesses ? 100 : 0;

      return {
        totalUsers: totalUsers || 0,
        totalBusinesses: totalBusinesses || 0,
        assignedBusinesses: assignedBusinesses || 0,
        newUsersThisMonth: currentUsers || 0,
        newBusinessesThisMonth: currentBusinesses || 0,
        userGrowthRate,
        businessGrowthRate,
        unassignedBusinesses: (totalBusinesses || 0) - (assignedBusinesses || 0)
      };
    },
  });

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (rate < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-green-500";
    if (rate < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const metrics = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      change: analytics?.userGrowthRate || 0,
      subtitle: `+${analytics?.newUsersThisMonth || 0} this month`
    },
    {
      title: "Total Businesses",
      value: analytics?.totalBusinesses || 0,
      change: analytics?.businessGrowthRate || 0,
      subtitle: `+${analytics?.newBusinessesThisMonth || 0} this month`
    },
    {
      title: "Assigned Businesses",
      value: analytics?.assignedBusinesses || 0,
      change: null,
      subtitle: `${analytics?.unassignedBusinesses || 0} unassigned`
    },
    {
      title: "Business Coverage",
      value: analytics?.totalBusinesses ? 
        `${Math.round(((analytics?.assignedBusinesses || 0) / analytics.totalBusinesses) * 100)}%` : '0%',
      change: null,
      subtitle: "Businesses with owners"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.change !== null && getGrowthIcon(metric.change)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center text-xs">
              {metric.change !== null && (
                <span className={getGrowthColor(metric.change)}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
              )}
              <span className={metric.change !== null ? "ml-1 text-muted-foreground" : "text-muted-foreground"}>
                {metric.subtitle}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};