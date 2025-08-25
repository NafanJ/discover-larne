import { AuthGuard } from "@/components/auth/AuthGuard";

const Admin = () => {
  return (
    <AuthGuard requireRole="admin">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-muted-foreground mb-4">
              Manage user accounts and roles
            </p>
            <p className="text-sm text-muted-foreground">
              Coming soon - manage users directly from the database for now
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Business Management</h2>
            <p className="text-muted-foreground mb-4">
              View and manage all business listings
            </p>
            <p className="text-sm text-muted-foreground">
              You can edit any business listing as an admin
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-muted-foreground mb-4">
              Configure application settings
            </p>
            <p className="text-sm text-muted-foreground">
              Coming soon - system configuration options
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Admin;