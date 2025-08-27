import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  ExternalLink, 
  Search,
  TrendingUp,
  Users,
  MousePointer,
  Filter
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export const AnalyticsDisplay = () => {
  const { data: analytics } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      
      // Get page views
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'page_view')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get outbound clicks
      const { data: outboundClicks, error: outboundClicksError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'outbound_click')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get search events
      const { data: searchEvents, error: searchEventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'search')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (pageViewsError || outboundClicksError || searchEventsError) {
        throw new Error('Failed to fetch analytics data');
      }

      // Calculate metrics
      const totalPageViews = pageViews?.length || 0;
      const uniqueVisitors = new Set(pageViews?.map(v => v.session_id)).size;
      const totalOutboundClicks = outboundClicks?.length || 0;
      const totalSearches = searchEvents?.length || 0;

      // Top searched terms
      const searchTerms = searchEvents
        ?.filter(e => e.event_data && typeof e.event_data === 'object' && 'query' in e.event_data)
        .reduce((acc: Record<string, number>, event) => {
          const eventData = event.event_data as any;
          const query = eventData.query?.toLowerCase();
          if (query) {
            acc[query] = (acc[query] || 0) + 1;
          }
          return acc;
        }, {});

      const topSearchTerms = Object.entries(searchTerms || {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([term, count]) => ({ term, count }));

      // Most viewed businesses
      const businessViews = pageViews
        ?.filter(v => v.business_id)
        .reduce((acc: Record<string, { name: string; count: number }>, view) => {
          const businessId = view.business_id!;
          const eventData = view.event_data as any;
          const businessName = eventData?.business_name || 'Unknown Business';
          
          if (!acc[businessId]) {
            acc[businessId] = { name: businessName, count: 0 };
          }
          acc[businessId].count++;
          return acc;
        }, {});

      const topBusinesses = Object.entries(businessViews || {})
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 10)
        .map(([id, data]) => ({ id, ...data }));

      // Click types breakdown
      const clickTypes = outboundClicks
        ?.reduce((acc: Record<string, number>, click) => {
          const eventData = click.event_data as any;
          const type = eventData?.click_type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

      return {
        totalPageViews,
        uniqueVisitors,
        totalOutboundClicks,
        totalSearches,
        topSearchTerms,
        topBusinesses,
        clickTypes: clickTypes || {}
      };
    },
  });

  const getClickTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'website': return '🌐';
      case 'directions': return '🗺️';
      default: return '🔗';
    }
  };

  const overviewCards = [
    {
      title: "Total Page Views",
      value: analytics?.totalPageViews || 0,
      icon: Eye,
      description: "Last 30 days"
    },
    {
      title: "Unique Visitors",
      value: analytics?.uniqueVisitors || 0,
      icon: Users,
      description: "Unique sessions"
    },
    {
      title: "Outbound Clicks",
      value: analytics?.totalOutboundClicks || 0,
      icon: MousePointer,
      description: "Calls, websites, directions"
    },
    {
      title: "Search Events",
      value: analytics?.totalSearches || 0,
      icon: Search,
      description: "Search queries & filters"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Search Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Top Search Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics?.topSearchTerms?.length ? (
                analytics.topSearchTerms.map(({ term, count }, index) => (
                  <div key={term} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm">{term}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {count} search{count !== 1 ? 'es' : ''}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No search data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Viewed Businesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Viewed Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics?.topBusinesses?.length ? (
                analytics.topBusinesses.map((business, index) => (
                  <div key={business.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm truncate">{business.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {business.count} view{business.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No business view data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Click Types Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Outbound Click Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics?.clickTypes || {}).length ? (
                Object.entries(analytics.clickTypes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getClickTypeIcon(type)}</span>
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} click{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">No click data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};