import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { AnalyticsDisplay } from "./AnalyticsDisplay";
import { RecentActivity } from "./RecentActivity";
import { SystemHealthMetrics } from "./SystemHealthMetrics";

export const SystemAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">System Analytics</h2>
      </div>

      <AnalyticsOverview />
      
      <AnalyticsDisplay />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <SystemHealthMetrics />
      </div>
    </div>
  );
};