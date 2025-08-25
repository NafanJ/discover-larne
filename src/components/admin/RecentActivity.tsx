import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Building, Calendar } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export const RecentActivity = () => {
  const { data: recentActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      // Get recent user signups
      const { data: recentUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent business additions
      const { data: recentBusinesses, error: businessesError } = await supabase
        .from('businesses')
        .select('id, name, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (usersError || businessesError) {
        throw new Error('Failed to fetch recent activity');
      }

      // Combine and sort all activities
      const activities = [
        ...(recentUsers || []).map(user => ({
          type: 'user_signup' as const,
          id: user.id,
          title: user.full_name || 'New User',
          subtitle: user.email,
          timestamp: user.created_at,
          icon: UserPlus
        })),
        ...(recentBusinesses || []).map(business => ({
          type: 'business_added' as const,
          id: business.id,
          title: business.name,
          subtitle: business.category || 'No category',
          timestamp: business.created_at,
          icon: Building
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .slice(0, 10);

      return activities;
    },
  });

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'HH:mm')}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'HH:mm')}`;
    }
    return format(date, 'MMM dd at HH:mm');
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <Badge variant="secondary">New User</Badge>;
      case 'business_added':
        return <Badge variant="outline">New Business</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!recentActivity || recentActivity.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No recent activity
            </p>
          ) : (
            recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Icon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      {getActivityBadge(activity.type)}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatActivityDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};