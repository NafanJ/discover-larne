import { AuthGuard } from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminBusinessManagement } from "@/components/admin/AdminBusinessManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemAnalytics } from "@/components/admin/SystemAnalytics";
import Navbar from "@/components/layout/Navbar";
import { Building, Users, BarChart3 } from "lucide-react";

const Admin = () => {
  return (
    <AuthGuard requireRole="admin">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Businesses
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="businesses">
            <AdminBusinessManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default Admin;