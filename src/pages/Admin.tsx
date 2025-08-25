import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminBusinessManagement } from "@/components/admin/AdminBusinessManagement";

const Admin = () => {
  return (
    <AuthGuard requireRole="admin">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        <AdminBusinessManagement />
      </div>
    </AuthGuard>
  );
};

export default Admin;