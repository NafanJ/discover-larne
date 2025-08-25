import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Image, AlertCircle, CheckCircle } from "lucide-react";

export const SystemHealthMetrics = () => {
  const { data: healthMetrics } = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: async () => {
      // Check database health by running simple queries
      const dbStart = Date.now();
      
      const { count: profilesCount, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { count: businessesCount, error: businessesError } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true });

      const { count: businessImagesCount, error: imagesError } = await supabase
        .from('business_images')
        .select('id', { count: 'exact', head: true });

      const dbResponseTime = Date.now() - dbStart;

      // Calculate storage usage estimation
      const storageUsageEstimate = (businessImagesCount || 0) * 0.5; // Assuming 500KB average per image
      const storageLimit = 1000; // 1GB limit for estimation

      // Determine system health status
      const isDatabaseHealthy = !profilesError && !businessesError && !imagesError && dbResponseTime < 1000;
      const isStorageHealthy = storageUsageEstimate < storageLimit * 0.8; // Less than 80% full

      return {
        database: {
          status: isDatabaseHealthy ? 'healthy' : 'warning',
          responseTime: dbResponseTime,
          tablesCount: 4, // Known table count
          recordsCount: (profilesCount || 0) + (businessesCount || 0) + (businessImagesCount || 0)
        },
        storage: {
          status: isStorageHealthy ? 'healthy' : 'warning',
          usedSpace: storageUsageEstimate,
          totalSpace: storageLimit,
          usagePercentage: Math.min((storageUsageEstimate / storageLimit) * 100, 100),
          filesCount: businessImagesCount || 0
        },
        overall: {
          status: isDatabaseHealthy && isStorageHealthy ? 'healthy' : 'warning'
        }
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="destructive">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {healthMetrics && getStatusIcon(healthMetrics.overall.status)}
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Database Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Database</span>
            </div>
            {healthMetrics && getStatusBadge(healthMetrics.database.status)}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Response time: {healthMetrics?.database.responseTime || 0}ms</p>
            <p>Total records: {healthMetrics?.database.recordsCount?.toLocaleString() || 0}</p>
            <p>Tables: {healthMetrics?.database.tablesCount || 0}</p>
          </div>
        </div>

        {/* Storage Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="text-sm font-medium">Storage</span>
            </div>
            {healthMetrics && getStatusBadge(healthMetrics.storage.status)}
          </div>
          <div className="space-y-2">
            <Progress value={healthMetrics?.storage.usagePercentage || 0} className="h-2" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                {(healthMetrics?.storage.usedSpace || 0).toFixed(1)} MB / 
                {(healthMetrics?.storage.totalSpace || 0).toFixed(0)} MB used
              </p>
              <p>Files stored: {healthMetrics?.storage.filesCount?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status</span>
            {healthMetrics && getStatusBadge(healthMetrics.overall.status)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};